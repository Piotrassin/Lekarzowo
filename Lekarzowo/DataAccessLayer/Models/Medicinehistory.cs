using System;
using System.Collections.Generic;

namespace Lekarzowo.Models
{
    public partial class Medicinehistory
    {
        public decimal MedicineId { get; set; }
        public decimal IllnesshistoryId { get; set; }
        public DateTime Startdate { get; set; }
        public DateTime Finishdate { get; set; }
        public string Description { get; set; }

        public virtual Illnesshistory Illnesshistory { get; set; }
        public virtual Medicine Medicine { get; set; }
    }
}
