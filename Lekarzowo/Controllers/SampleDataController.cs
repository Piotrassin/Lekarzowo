using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.Models;
using Microsoft.AspNetCore.Mvc;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private static string[] Summaries = new[]{
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private static ModelContext _context = new ModelContext();

        [HttpGet("[action]")]
        public IEnumerable<WeatherForecast> WeatherForecasts()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                DateFormatted = DateTime.Now.AddDays(index).ToString("d"),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            });
        }


        [HttpGet("[action]")]
        public IEnumerable<View_AddressData> AddressData()
        {
            return _context.View_AddressData.ToList();
        }

        [HttpGet("[action]")]
        public IEnumerable<View_DocsAndSpecs> DocsAndSpecs()
        {
            return _context.View_DocsAndSpecs.ToList();
        }

        [HttpGet("[action]")]
        public IEnumerable<View_DoctorList> DoctorList()
        {
            return _context.View_DoctorList.ToList();
        }

        [HttpGet("[action]")]
        public IEnumerable<View_DoctorSchedule> DoctorSchedule()
        {
            return _context.View_DoctorSchedule.ToList();
        }

        [HttpGet("[action]")]
        public IEnumerable<View_IllnessMedDetails> IllnessMedDetails()
        {
            return _context.View_IllnessMedDetails.ToList();
        }

        [HttpGet("[action]")]
        public IEnumerable<View_IllnessMedList> IllnessMedList()
        {
            return _context.View_IllnessMedList.ToList();
        }

        [HttpGet("[action]")]
        public IEnumerable<View_PatientIllnesses> PatientIllnesses()
        {
            return _context.View_PatientIllnesses.ToList();
        }

        //[HttpGet("[action]")]
        //public IEnumerable<View_VisitDetails> AddressData()
        //{
        //    return _context.View_VisitDetails.ToList();
        //}
        //[HttpGet("[action]")]
        //public IEnumerable<View_VisitList> AddressData()
        //{
        //    return _context.View_VisitList.ToList();
        //}


        public class WeatherForecast
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }
    }
}
