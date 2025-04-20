using Microsoft.ML.Data;

namespace webapi.Data;

public class SentimentPrediction
{
    [ColumnName("PredictedLabel")] public bool Prediction { get; set; }
    public float Probability { get; set; }
    public float Score { get; set; }
}