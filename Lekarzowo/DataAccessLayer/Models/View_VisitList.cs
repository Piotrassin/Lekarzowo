using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Models
{
    public class View_VisitList
    {
        /// <summary>
        /// Zobacz listę wizyt (Lekarz, Pacjent)
        /// Patient(Person) + Visit + Reservation + Patient(Person)
        /// </summary>

        [Column("Patient_Id")]
        public int PatientId { get; set; }
        [Column("Doctor_Name")]
        public String DoctorName { get; set; }
        [Column("Doctor_Lastname")]
        public String DoctorLastname { get; set; }
        [Column("Speciality_Name")]
        public String SpecialityName { get; set; }
        [Column("Reservation_Id")]
        public int ReservationId { get; set; }
        [Column("Reservation_StartTime")]
        public DateTime ReservationStartTime { get; set; }
        [Column("Local_Name")]
        public String LocalName { get; set; }
    }
}
