using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Transforms.Text;
using webapi.Data;

namespace webapi.ML;

// Clase para almacenar el modelo entrenado y su contexto
public class TrainedModel
{
    public MLContext MlContext { get; set; } = new MLContext();
    public ITransformer Model { get; set; } = default!;
}

public static class ModelBuilder
{
    private static readonly string DataPath = Path.Combine(AppContext.BaseDirectory, "Data", "ecommerce_sentiment_dataset.tsv");
    private static readonly string ModelPath = Path.Combine(AppContext.BaseDirectory, "ml-model.zip");

    public static TrainedModel LoadOrCreateModel()
    {
        var mlContext = new MLContext(seed: 0);

        if (!File.Exists(ModelPath))
        {
            var model = TrainModel(mlContext, out DataViewSchema schema);
            mlContext.Model.Save(model, schema, ModelPath);
            return new TrainedModel { MlContext = mlContext, Model = model };
        }

        var loadedModel = mlContext.Model.Load(ModelPath, out _);
        return new TrainedModel { MlContext = mlContext, Model = loadedModel };
    }

    private static ITransformer TrainModel(MLContext mlContext, out DataViewSchema schema)
    {
        Console.WriteLine("➡ Entrenando modelo de análisis de sentimientos...");

        // Cargar el dataset desde archivo TSV
        var data = mlContext.Data.LoadFromTextFile<SentimentData>(DataPath, hasHeader: true, separatorChar: '\t');
        var splitData = mlContext.Data.TrainTestSplit(data, testFraction: 0.2);

        // Configurar opciones para extracción de características (n-gramas)
        var options = new TextFeaturizingEstimator.Options()
        {
            WordFeatureExtractor = new WordBagEstimator.Options { NgramLength = 2, UseAllLengths = true },
            CharFeatureExtractor = null,
            Norm = TextFeaturizingEstimator.NormFunction.None,
            OutputTokensColumnName = "OutputTokens"
        };

        // Construcción del pipeline de procesamiento de texto + normalización + conversión del label a bool + entrenamiento
        var pipeline = mlContext.Transforms.Text.FeaturizeText("Features", options, nameof(SentimentData.Text))
            .Append(mlContext.Transforms.NormalizeMinMax("Features", "Features"))
            .Append(mlContext.Transforms.Conversion.ConvertType("LabelBool", "Label", DataKind.Boolean));

        var trainer = mlContext.BinaryClassification.Trainers.SdcaLogisticRegression(labelColumnName: "LabelBool",
            featureColumnName: "Features");
        var trainingPipeline = pipeline.Append(trainer);
        var model = trainingPipeline.Fit(splitData.TrainSet);

        // Evaluar el modelo entrenado con el conjunto de prueba
        EvaluateModel(mlContext, model, splitData.TestSet);

        schema = data.Schema;
        return model;
    }

    // Evalúa el modelo y muestra métricas en consola
    private static void EvaluateModel(MLContext mlContext, ITransformer model, IDataView testSet)
    {
        var predictions = model.Transform(testSet);
        var metrics = mlContext.BinaryClassification.Evaluate(predictions, labelColumnName: nameof(SentimentData.Label));

        Console.WriteLine($"""
                               ✅ Modelo evaluado:
                               - Accuracy: {metrics.Accuracy:P2}
                               - F1 Score: {metrics.F1Score:P2}
                               - AUC: {metrics.AreaUnderRocCurve:P2}
                           """);
    }
}