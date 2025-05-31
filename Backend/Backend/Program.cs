using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Backend.Controllers.authentication;
using System.Security.Cryptography;

var builder = WebApplication.CreateBuilder(args);

// Konfigurimi i konfigurimeve nga appsettings.json
var configuration = builder.Configuration;

// Marrja e çelësit sekret nga konfigurimi
var secretKey = configuration["JwtSettings:SecretKey"];
if (string.IsNullOrEmpty(secretKey))
    throw new Exception("JWT SecretKey nuk është caktuar në konfigurim.");

var key = Encoding.UTF8.GetBytes(secretKey);
var symmetricKey = new SymmetricSecurityKey(key);

// Shtimi i dependencave të nevojshme
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddTransient<Backend.Pdf.PdfGenerator>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

builder.Services.AddControllers()
    .AddJsonOptions(x =>
        x.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);

// Swagger (vetëm për zhvillim)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Konfigurimi i CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", corsBuilder =>
    {
        corsBuilder.WithOrigins("http://localhost:3000")
                   .AllowCredentials()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
    });
});

// Konfigurimi i autentikimit me JWT nga cookie
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["JwtSettings:Issuer"],
            ValidAudience = configuration["JwtSettings:Audience"],
            IssuerSigningKey = symmetricKey
        };

        // Leximi i tokenit nga cookie në vend të header-it
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Cookies["accessToken"];
                if (!string.IsNullOrEmpty(token))
                {
                    context.Token = token;
                }
                return Task.CompletedTask;
            }
        };
    });

// Konfigurimi i databazës
builder.Services.AddDbContext<NovaBankDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Middleware i Swagger (vetëm në dev)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware pipeline
app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication(); // Duhet para UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.Run();