using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.DTO
{
    public class WorkingHoursDTO
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public decimal DoctorId { get; set; }
        public decimal LocalId { get; set; }
    }
}
