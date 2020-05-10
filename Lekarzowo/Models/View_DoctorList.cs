using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Models
{
    public class View_DoctorList
    {
        [Column("Person_Name")]
        public String DoctorName { get; set; }
        [Column("Person_Lastname")]
        public String DoctorLastname { get; set; }
        [Column("Doctor_Id")]
        public int DoctorId { get; set; }
        [Column("Speciality_Name")]
        public String SpecialityName { get; set; }
        [Column("Speciality_Price")]
        public int SpecialityPrice { get; set; }
        [Column("WorkingHours_From")]
        public DateTime WorkingHoursFrom { get; set; }
        [Column("WorkingHours_To")]
        public DateTime WorkingHoursTo { get; set; }
        [Column("Local_Name")]
        public String LocalName { get; set; }
        [Column("Local_StreetName")]
        public String LocalStreetName { get; set; }
        [Column("Local_StreetNumber")]
        public int LocalStreetNumber { get; set; }
        [Column("Local_BlockNumber")]
        public String LocalBlockNUmber { get; set; }
        [Column("City_Name")]
        public String CityName { get; set; }
    }
}
