using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Models
{
    public class View_IllnessMedDetails
    {
        /// <summary>
        /// Sprawdź historię leków (Lekarz, Pacjent)
        /// Patient(Person) + IllnessHistory + MedicineHistory + OldIllnessHistory + OldMedicineHistory + Medicine + Illness + Visit + Reservation
        /// </summary>

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

        [Column("Visit_Description")]
        public String VisitDescription { get; set; }

        [Column("Illness_Name")]
        public String IllnessName { get; set; }

        [Column("Illness_Description")]
        public String IllnessDescription { get; set; }

        [Column("IllnessHistory_Description")]
        public String IllnessHistoryDescription { get; set; }

        [Column("IllnessHistory_CureDate")]
        public DateTime? IllnessHistoryCureDate { get; set; }

        [Column("OldIllnessHistory_Date")]
        public DateTime OldIllnessHistoryDate { get; set; }

        [Column("OldIllnessHistory_Description")]
        public String OldIllnessHistoryDescription { get; set; }

        [Column("OldIllnessHistory_CureDate")]
        public DateTime? OldIllnessHistoryCureDate { get; set; }

        [Column("OldMedicineHistory_Date")]
        public DateTime OldMedicineHistoryDate { get; set; }

        [Column("OldMedicineHistory_Description")]
        public String OldMedicineHistoryDescription { get; set; }

        [Column("Medicine_Name")]
        public String MedicineName { get; set; }

        [Column("MedicineHistory_StartDate")]
        public DateTime MedicineHistoryStartDate { get; set; }

        [Column("MedicineHistory_FinishDate")]
        public DateTime? MedicineHistoryFinishDate { get; set; } //może powinno być nullable

        [Column("MedicineHistory_Description")]
        public String MedicineHistoryDescription { get; set; }


    }
}
