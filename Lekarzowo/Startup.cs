using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
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
using System.Text;

namespace Lekarzowo
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            #region Accessing appsettings.json
            var appSettings = Configuration.GetSection("SecretSection");
            services.Configure<SecretSettings>(appSettings);

            var secretSettings = appSettings.Get<SecretSettings>();
            var key = Encoding.ASCII.GetBytes(secretSettings.Secret);
            #endregion

            #region Accessing appsettings.json v2.0
            services.AddOptions();
            services.Configure<SecretSettings>(Configuration.GetSection("SecretSection"));
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
                    ValidateAudience = false
                };
            });
            //services.AddScoped<JWTService>(s => s.GetService<IOptions<SecretSettings>>().Value);
            services.AddScoped<JWTService>();
            #endregion

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
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






            services.AddEntityFrameworkOracle()
                .AddDbContext<ModelContext>(options =>
                {
                    options.UseOracle(Configuration.GetConnectionString("DefaultConnection"));
                });
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

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
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
