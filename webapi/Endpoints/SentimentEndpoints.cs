using webapi.Data;
using webapi.ML;

namespace webapi.Endpoints;

public static class SentimentEndpoints
{
    public static WebApplication MapSentimentEndpoints(this WebApplication app)
    {
        var mlModel = ModelBuilder.LoadOrCreateModel();
        var predictor = mlModel.MlContext.Model.CreatePredictionEngine<SentimentData, SentimentPrediction>(mlModel.Model);

        app.MapPost("/predict", (SentimentData input) =>
            {
                var prediction = predictor.Predict(input);
                return Results.Ok(prediction);
            })
            .WithName("PredictSentiment")
            .WithOpenApi();

        return app;
    }
}