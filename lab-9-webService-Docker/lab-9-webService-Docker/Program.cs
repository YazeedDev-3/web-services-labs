using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using lab_9_webService_Docker.Data;
var builder = WebApplication.CreateBuilder(args);

/* Database Context Dependency Injection */
var dbHost = Environment.GetEnvironmentVariable("DB_HOST");
var dbName = Environment.GetEnvironmentVariable("DB_NAME");
var dbPassword = Environment.GetEnvironmentVariable("DB_SA_PASSWORD");
var dbUser = Environment.GetEnvironmentVariable("DB_USER");

// Disabled SSL encryption and trusted server certificate to fix SQL connection error inside Docker
var connectionString = $"Server={dbHost},1433;Database={dbName};User ID={dbUser};Password={dbPassword};Encrypt=False;TrustServerCertificate=True;";

builder.Services.AddDbContext<lab_9_webService_DockerContext>(opt =>
    opt.UseSqlServer(connectionString));
/* ===================================== */

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<lab_9_webService_DockerContext>();
    db.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
