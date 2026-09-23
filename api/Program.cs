using System.Text.Json.Serialization;
using HuntLog.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ---------- 1. Register services (the dependency injection container) ----------

builder.Services
    .AddControllers()
    // Send/accept enums as "Applied" instead of 1 in JSON. That's friendlier
    // for the React app and for anyone reading the API.
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// Register the DbContext. This one line is where the DATABASE PROVIDER is chosen.
// To switch to SQL Server later:
//   1. dotnet add package Microsoft.EntityFrameworkCore.SqlServer
//   2. change UseSqlite(...) to UseSqlServer(...)
//   3. put a SQL Server connection string in appsettings.json
//   4. delete the Migrations folder and run: dotnet ef migrations add InitialCreate
//      (migrations contain provider-specific SQL, so they are regenerated)
// Models, DbContext, and controllers stay exactly the same.
builder.Services.AddDbContext<HuntLogDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("HuntLog")));

// CORS (Cross-Origin Resource Sharing). The React dev server runs on
// http://localhost:5180 and the API on http://localhost:5041. Different ports
// count as different "origins", and browsers block cross-origin requests
// unless the SERVER says they're allowed. This policy allows our client only,
// rather than "*" (any website). The origin is read from appsettings.json.
const string ClientCorsPolicy = "ClientDevServer";
var clientOrigin = builder.Configuration["Cors:ClientOrigin"] ?? "http://localhost:5180";
builder.Services.AddCors(options =>
    options.AddPolicy(ClientCorsPolicy, policy =>
        policy.WithOrigins(clientOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod()));

// Swagger generates an interactive web page that documents and tests the API.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ---------- 2. Apply migrations on startup ----------
// This app runs locally only, so creating/upgrading huntlog.db automatically
// saves a manual step. In a real production system you'd usually run
// migrations as a separate, deliberate deployment step instead.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<HuntLogDbContext>();
    db.Database.Migrate();
}

// ---------- 3. Configure the HTTP request pipeline (middleware) ----------
// Each request passes through these in order.

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();    // serves the JSON description at /swagger/v1/swagger.json
    app.UseSwaggerUI();  // serves the web page at /swagger
}

// No UseHttpsRedirection / UseAuthorization: the app runs on http://localhost
// only and has no login (auth is listed as a "next step" in the README).

app.UseCors(ClientCorsPolicy); // must run before the controllers handle the request

app.MapControllers(); // route requests to our [ApiController] classes

app.Run();
