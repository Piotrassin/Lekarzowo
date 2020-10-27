using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Models
{
    public class View_IllnessMedList
    {
        /// <summary>
        /// Sprawdź choroby (Lekarz, Pacjent)
        /// Patient(Person) + IllnessHistory + OldIlnessHistory + Illness + Visit + Reservation
        /// </summary>
        /// 
        [Column("Patient_Id")]
        public int PatientId { get; set; }

        [Column("Person_Name")]
        public String PatientName { get; set; }

        [Column("Person_Lastname")]
        public String PatientLastname { get; set; }

        [Column("Reservation_Id")]
        public int ReservationId { get; set; }

        [Column("Reservation_StartTime")]
        public DateTime ReservationStartTime { get; set; }

        [Column("Illness_Name")]
        public String IllnessName { get; set; }

        [Column("IllnessHistory_CureDate")]
        public DateTime? IllnessHistoryCureDate { get; set; }

        [Column("OldIllnessHistory_Date")]
        public DateTime OldIllnessHistoryDate { get; set; }

        [Column("OldIllnessHistory_CureDate")]
        public DateTime? OldIllnessHistoryCureDate { get; set; }
    }
}
