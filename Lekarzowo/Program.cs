using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Lekarzowo
{        //Scaffold-DbContext "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=db-oracle)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=BAZA.PJWSTK.EDU.PL)));Persist Security Info=True;User Id=S17437;Password=oracle12;" Oracle.EntityFrameworkCore -OutputDir Models

    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
