using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.DTO
{
    public class ReservationDTO
    {
        public decimal Id { get; set; }
        public decimal DoctorId { get; set; }
        public decimal PatientId { get; set; }
        public DateTime Starttime { get; set; }
        public DateTime Endtime { get; set; }
        public decimal? Canceled { get; set; }
        public decimal LocalId { get; set; }
    }
}
