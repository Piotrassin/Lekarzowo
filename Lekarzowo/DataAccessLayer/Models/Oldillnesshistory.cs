using System;
using System.Collections.Generic;

namespace Lekarzowo.DataAccessLayer.Models
{
    public partial class Oldillnesshistory
    {
        public decimal IllnessId { get; set; }
        public decimal PatientId { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public DateTime? Curedate { get; set; }

        public virtual Illness Illness { get; set; }
        public virtual Patient Patient { get; set; }
    }
}
