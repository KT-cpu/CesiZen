using System;
using System.Text;
using CesiZen.API.Middlewares;
using CesiZen.API.Services;
using CesiZen.Domain.Interfaces.Repository;
using CesiZen.Domain.Interfaces.Service;
using CesiZen.Infrastructure.Data;
using CesiZen.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace CesiZen.API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration
                .GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException(
                    "La chaîne de connexion 'DefaultConnection' n'est pas configurée.");

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString, npgsqlOptions =>
                npgsqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorCodesToAdd: null))
            .ConfigureWarnings(warnings =>
                warnings.Ignore(RelationalEventId.PendingModelChangesWarning)));

            builder.Services.AddHealthChecks()
                .AddDbContextCheck<ApplicationDbContext>(name: "database");

            var jwtSecret = builder.Configuration["JwtSettings:Secret"]
                ?? throw new InvalidOperationException(
                    "La variable d'environnement JwtSettings:Secret n'est pas définie.");

            if (jwtSecret.Length < 32)
                throw new InvalidOperationException(
                    "JwtSettings:Secret doit contenir au moins 32 caractères.");

            var key = Encoding.UTF8.GetBytes(jwtSecret);

            builder.Services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme =
                        JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme =
                        JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
                    options.SaveToken = false;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = true,
                        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                        ValidateAudience = true,
                        ValidAudience = builder.Configuration["JwtSettings:Audience"],
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });

            var originesAutorisees = builder.Configuration
                .GetSection("Cors:OriginesAutorisees")
                .Get<string[]>()
                ?? Array.Empty<string>();


            builder.Services.AddCors(options =>
                options.AddPolicy("CesiZenPolicy", policy =>
                {
                    if (builder.Environment.IsDevelopment())
                    {
                        policy.AllowAnyOrigin()
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    }
                    else
                    {
                        policy.WithOrigins(originesAutorisees)
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .WithExposedHeaders("Content-Disposition");
                    }
                }));

            builder.Services.AddScoped<IUtilisateurRepository, UtilisateurRepository>();
            builder.Services.AddScoped<ITrackerEmotionRepository, TrackerEmotionRepository>();
            builder.Services.AddScoped<IInformationRepository, InformationRepository>();
            builder.Services.AddScoped<IEmotion1Repository, Emotion1Repository>();
            builder.Services.AddScoped<IEmotion2Repository, Emotion2Repository>();

            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IUtilisateurService, UtilisateurService>();
            builder.Services.AddScoped<ITrackerEmotionService, TrackerEmotionService>();
            builder.Services.AddScoped<IInformationService, InformationService>();
            builder.Services.AddScoped<IEmotionService, EmotionService>();

            builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(
                    new System.Text.Json.Serialization.JsonStringEnumConverter());
            });
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "CesiZen API",
                    Version = "v1",
                    Description = "API CesiZen — santé mentale et gestion du stress."
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Entrez votre token JWT. Exemple : Bearer {votre_token}"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            builder.Services.AddHsts(options =>
            {
                options.Preload = true;
                options.IncludeSubDomains = true;
                options.MaxAge = TimeSpan.FromDays(365);
            });

            var app = builder.Build();

        if (!app.Environment.IsEnvironment("Testing"))
        {
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider
                    .GetRequiredService<ApplicationDbContext>();
                var logger = scope.ServiceProvider
                    .GetRequiredService<ILogger<Program>>();
                try
                {
                    db.Database.Migrate();
                    logger.LogInformation("Migrations appliquées avec succès.");

                    var adminPassword = builder.Configuration["Seed:AdminPassword"]
                        ?? throw new InvalidOperationException(
                            "Seed__AdminPassword n'est pas défini.");

                    var seeder = new DatabaseSeeder(db, scope.ServiceProvider
                        .GetRequiredService<ILogger<DatabaseSeeder>>());

                    await seeder.SeedAsync(adminPassword);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Erreur au démarrage.");
                    throw;
                }
            }
        }

            app.UseMiddleware<ExceptionMiddleware>();

            if (!app.Environment.IsDevelopment())
            {
                app.UseHsts();
                app.UseHttpsRedirection();
            }

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "CesiZen API v1");
                    options.DisplayRequestDuration();
                });
            }

            app.UseCors("CesiZenPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.Use(async (context, next) =>
            {
                context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Append("X-Frame-Options", "DENY");
                context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
                context.Response.Headers.Append(
                    "Referrer-Policy", "strict-origin-when-cross-origin");
                context.Response.Headers.Append(
                    "Permissions-Policy", "camera=(), microphone=(), geolocation=()");
                await next();
            });


            app.MapHealthChecks("/health");

            app.MapControllers();

            app.Run();
        }
    }
}