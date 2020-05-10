using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Models
{
    public class View_DoctorSchedule
    {
        [Column("Reservation_Id")]
        public int ReservationId { get; set; }
        [Column("Reservation_StartTime")]
        public DateTime ReservationStartTime { get; set; }
        [Column("Reservation_EndTime")]
        public DateTime ReservationEndTime { get; set; }
        [Column("Reservation_Canceled")]
        public DateTime ReservationCanceled { get; set; }
        [Column("Patient_Id")]
        public int PatientId { get; set; }
        [Column("Person_Name")]
        public String PatientName { get; set; }
        [Column("Person_Lastname")]
        public String PatientLastname { get; set; }
        [Column("Room_Number")]
        public int RoomNumber { get; set; }
        [Column("Local_Name")]
        public String LocalName { get; set; }
        [Column("Local_StreetName")]
        public String LocalStreetName { get; set; }
        [Column("Local_StreetNumber")]
        public int LocalStreetNumber { get; set; }
        [Column("Local_BlockNUmber")]
        public String LocalBlockNUmber { get; set; }
        [Column("City_Name")]
        public String CityName { get; set; }


    }
}
