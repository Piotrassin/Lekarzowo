using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Models
{
    public class View_PatientIllnesses
    {
        [Column("Patient_Id")]
        public int PatientId { get; set; }

        [Column("Person_Name")]
        public String PatientName { get; set; }

        [Column("Person_Lastname")]
        public String PatientLastname { get; set; }

        [Column("Illness_Name")]
        public String IllnessName { get; set; }

        [Column("IllnessHistory_Id")]
        public int IllnessHistoryId { get; set; }

        [Column("IllnessHistory_CureDate")]
        public DateTime? IllnessHistoryCureDate { get; set; }

        [Column("OldIllnessHistory_Id")]
        public int OldIllnessHistoryId { get; set; }


    }
}
