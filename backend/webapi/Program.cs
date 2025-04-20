using Microsoft.Extensions.ML;
using webapi.Data;
using webapi.Endpoints;
using webapi.ML;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var modelFilePath = Path.Combine(AppContext.BaseDirectory, "ml-model.zip");
ModelBuilder.LoadOrCreateModel();
// 1.2. Registra el pool, dándole un nombre arbitrario
builder.Services
    .AddPredictionEnginePool<SentimentData, SentimentPrediction>()
    .FromFile(modelName: "SentimentModel", filePath: modelFilePath, watchForChanges: true);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        corsPolicyBuilder =>
        {
            corsPolicyBuilder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.UseSwagger();
    //app.UseSwaggerUI();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAllOrigins");

app.UseHttpsRedirection();

app.MapSentimentEndpoints();

app.Run();
