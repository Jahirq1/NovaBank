using Backend.Data;
using Backend.Services; // Add this if SessionService is in Services folder
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 🔌 Add EF Core
builder.Services.AddDbContext<NovaBankDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 🔒 Add Session
builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.None;
    options.Cookie.SameSite = SameSiteMode.None;
    options.IdleTimeout = TimeSpan.FromDays(30); // Session timeout
});

// 🧠 Add Session Service + Context Accessor
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddScoped<SessionService>(); // <-- required for AuthController

// 🔐 Add Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🌍 CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
        builder.WithOrigins("http://localhost:3000") // frontend URL
               .AllowCredentials()
               .AllowAnyHeader()
               .AllowAnyMethod());
});

var app = builder.Build();

// 🧪 Dev Tools
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 🔁 Middleware pipeline
app.UseHttpsRedirection();
app.UseCors("AllowFrontend"); // Must match policy name
app.UseSession();             // Important: MUST come before UseAuthorization
app.UseAuthorization();
app.MapControllers();

app.Run();
