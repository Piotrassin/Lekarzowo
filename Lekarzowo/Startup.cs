using FluentValidation.AspNetCore;
using Lekarzowo.Controllers;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Filters;
using Lekarzowo.Helpers;
using Lekarzowo.Repositories;
using Lekarzowo.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using System.Threading.Tasks;

namespace Lekarzowo
{
    public class Startup
    {
        private static bool hasTokenExpired = false;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHttpContextAccessor();

            #region Accessing appsettings.json
            services.AddOptions();
            var appSettings = Configuration.GetSection("SecretSection");
            services.Configure<SecretSettings>(appSettings);

            var key = Encoding.ASCII.GetBytes(appSettings.Get<SecretSettings>().Secret);
            services.AddScoped<IJWTService, JWTService>();
            #endregion

            #region Authentication config

            services.AddAuthentication(s =>
            {
                s.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                s.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(b =>
            {
                //TODO: false FOR DEVELOPMENT ONLY
                b.RequireHttpsMetadata = false;

                b.SaveToken = true;
                b.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                };
                b.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = httpContext =>
                    {
                        if (httpContext.Exception.GetType() == typeof(SecurityTokenExpiredException))
                        {
                            hasTokenExpired = true;
                            //httpContext.Response.Headers.Add("Token_has_expired", "true");
                        }
                        else
                        {
                            hasTokenExpired = false;
                        }

                        return Task.CompletedTask;
                    },
                };
            });
            //services.AddScoped<JWTService>(s => s.GetService<IOptions<SecretSettings>>().Value);
            services.AddScoped<JWTService>();
            #endregion
            services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  builder =>
                                  {
                                      builder.WithOrigins("http://localhost:3000"
                                                          ).AllowAnyHeader()
                                                           .AllowAnyMethod();
                                  });
            });

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(cors =>
                {
                    cors.AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowAnyOrigin();
                });
            });

            services.AddMvc(options =>
                {
                    options.Filters.Add(new ModelValidationFilter());
                })
                .AddFluentValidation(options =>
                {
                    options.RegisterValidatorsFromAssemblyContaining<Startup>();
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddJsonOptions(
                    options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                );

            services.AddSwaggerGen();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddScoped(typeof(IBaseNameRepository<>), typeof(BaseNameRepository<>));
            services.AddScoped(typeof(IBaseIdRepository<>), typeof(BaseIdRepository<>));
            services.AddScoped<ICitiesRepository, CitiesRepository>();
            services.AddScoped<IDoctorsRepository, DoctorsRepository>();
            services.AddScoped<IIllnessesRepository, IllnessesRepository>();
            services.AddScoped<IIllnessesHistoryRepository, IllnessesHistoryRepository>();
            services.AddScoped<ILocalsRepository, LocalsRepository>();
            services.AddScoped<IMedicinesRepository, MedicinesRepository>();
            services.AddScoped<IMedicinesHistoryRepository, MedicinesHistoryRepository>();
            services.AddScoped<IOldIllnessesHistoryRepository, OldIllnessesHistoryRepository>();
            services.AddScoped<IOldMedicinesHistoryRepository, OldMedicinesHistoryRepository>();
            services.AddScoped<IPatientsRepository, PatientsRepository>();
            services.AddScoped<IPeopleRepository, PeopleRepository>();
            services.AddScoped<IReferralsRepository, ReferralsRepository>();
            services.AddScoped<IReservationsRepository, ReservationsRepository>();
            services.AddScoped<IRoomsRepository, RoomsRepository>();
            services.AddScoped<ISpecialitiesRepository, SpecialitiesRepository>();
            services.AddScoped<ITreatmentsOnVisitRepository, TreatmentsOnVisitRepository>();
            services.AddScoped<ITreatmentsRepository, TreatmentsRepository>();
            services.AddScoped<IVisitsRepository, VisitsRepository>();
            services.AddScoped<IWorkingHoursRepository, WorkingHoursRepository>();
            services.AddScoped<IUserInterfaceComponentsRepository, UserInterfaceComponentsRepository>();
            services.AddScoped<IStandardUserRolesRepository, StandardUserRolesRepository>();
            services.AddScoped<IRolesRepository, RolesRepository>();

            services.AddScoped<ICustomUserRolesService, CustomUserRolesService>();
            services.AddScoped<PeopleController, PeopleController>();

            services.AddEntityFrameworkOracle()
                .AddDbContext<ModelContext>(options =>
                {
                    options.UseOracle(Configuration.GetConnectionString("pjatkConnection"));
                    //options.UseOracle(Configuration.GetConnectionString("selfHostedConnection"));

                });

            //services.AddMvc()
            //    .AddJsonOptions(
            //        options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            //    );
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors();

            app.Use(async (context, next) =>
            {
                context.Response.Headers["Token_has_expired"] = hasTokenExpired.ToString();
                await next.Invoke();
            });

            app.UseSwagger();
            app.UseSwaggerUI(x =>
            {
                x.SwaggerEndpoint("/swagger/v1/swagger.json", "Lekarzowo API v1");
                x.RoutePrefix = "swagger";
            });

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseCors(MyAllowSpecificOrigins);
            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });

        }
    }
}
