var builder = WebApplication.CreateBuilder(args);

// Compute the absolute path to the .mdf file at startup and inject it into the connection string.
// The .mdf lives in the solution folder (one level above the project folder).
// This avoids |DataDirectory| which is unreliable with System.Data.SqlClient in .NET Core.
var mdfPath = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "..", "DB-webService-lab2.mdf"));
builder.Configuration["ConnectionStrings:DefaultConnection"] =
    $"Data Source=(LocalDB)\\MSSQLLocalDB;AttachDbFilename={mdfPath};Integrated Security=True;Connect Timeout=30";

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(o =>
{
    o.AddPolicy("_myAllowSpecificOrigins", p =>
        p.AllowAnyOrigin()
         .AllowAnyMethod()
         .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();
app.UseCors("_myAllowSpecificOrigins");
app.UseHttpsRedirection();
app.UseStaticFiles();

app.Run();
