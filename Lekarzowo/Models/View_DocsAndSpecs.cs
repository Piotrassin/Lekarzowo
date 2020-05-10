using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Models
{
    public class View_DocsAndSpecs
    {
        [Column("Doctor_Id")]
        public int Doctor_Id { get; private set; }
        [Column("Speciality_Name")]
        public String SpecialityName { get; private set; }
        [Column("Speciality_Price")]
        public int SpecialityPrice { get; private set; }
    }
}
