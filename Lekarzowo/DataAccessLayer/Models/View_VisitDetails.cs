using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Models
{
    public class View_VisitDetails
    {
        /// <summary>
        /// Sprawdź poprzednie wizyty (Pacjent, Lekarz)
        /// Patient(Person) + Reservation + Visit + TreatmentOnVisit + Treatment + IllnessHistory + Illness + MedicineHistory + Medicine + Doctor(Person)
        /// </summary>

        [Column("Room_Number")]
        public int RoomNumber { get; set; }
        [Column("City_Name")]
        public String CityName { get; set; }
        [Column("Local_BlockNumber")]
        public String LocalBlockNumber { get; set; }
        [Column("Local_StreetNumber")]
        public int LocalStreetNumber { get; set; }
        [Column("Local_Postcode")]
        public String LocalPostcode { get; set; }
        [Column("Local_StreetName")]
        public String LocalStreetName { get; set; }
        [Column("Local_Name")]
        public String LocalName { get; set; }
        [Column("TreatmentOnVisit_Description")]
        public String TreatmentOnVisitDescription { get; set; }
        [Column("Treatment_Price")]
        public int TreatmentPrice { get; set; }
        [Column("Treatment_Name")]
        public String TreatmentName { get; set; }
        [Column("MedicineHistory_Description")]
        public String MedicineHistoryDescription { get; set; }
        [Column("MedicineHistory_EndDate")]
        public DateTime MedicineHistoryEndDate { get; set; }
        [Column("MedicineHistory_StartDate")]
        public DateTime MedicineHistoryStartDate { get; set; }
        [Column("Medicine_Name")]
        public String MedicineName { get; set; }
        [Column("IllnessHistory_CureDate")]
        public DateTime? IllnessHistoryCureDate { get; set; }
        [Column("IllnessHistory_Description")]
        public String IllnessHistoryDescription { get; set; }
        [Column("Illness_Name")]
        public String IllnessName { get; set; }
        [Column("Visit_Description")]
        public String VisitDescription { get; set; }
        [Column("Visit_Price")]
        public int VisitPrice { get; set; }
        [Column("Reservation_StartTime")]
        public DateTime ReservationStartTime { get; set; }
        [Column("Reservation_Id")]
        public int ReservationId { get; set; }
        [Column("Speciality_Price")]
        public int SpecialityPrice { get; set; }
        [Column("Speciality_Name")]
        public String SpecialityName { get; set; }
        [Column("Doctor_Lastname")]
        public String DoctorLastname { get; set; }
        [Column("Doctor_Name")]
        public String DoctorName { get; set; }
        [Column("Patient_Birthdate")]
        public DateTime PatientBirthdate { get; set; }
        [Column("Patient_Lastname")]
        public String PatientLastname { get; set; }
        [Column("Patient_Name")]
        public String PatientName { get; set; }
        [Column("Patient_Id")]
        public int PatientId { get; set; }
    }
}
