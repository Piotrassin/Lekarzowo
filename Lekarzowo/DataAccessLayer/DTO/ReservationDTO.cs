using System;

namespace Lekarzowo.DataAccessLayer.DTO
{
    public class ReservationDTO : IReservation
    {
        public decimal Id { get; set; }
        public decimal DoctorId { get; set; }
        public decimal PatientId { get; set; }
        public DateTime Starttime { get; set; }
        public DateTime Endtime { get; set; }
        public bool Canceled { get; set; }
        public decimal LocalId { get; set; }
    }
}
