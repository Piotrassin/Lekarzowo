using System;
using System.Collections.Generic;

namespace Lekarzowo.Models
{
    public partial class Illnesshistory
    {
        public Illnesshistory()
        {
            Medicinehistory = new HashSet<Medicinehistory>();
        }

        public decimal Id { get; set; }
        public decimal PatientId { get; set; }
        public decimal IllnessId { get; set; }
        public decimal VisitId { get; set; }
        public string Description { get; set; }
        public DateTime? Curedate { get; set; }

        public virtual Illness Illness { get; set; }
        public virtual Patient Patient { get; set; }
        public virtual Visit Visit { get; set; }
        public virtual ICollection<Medicinehistory> Medicinehistory { get; set; }
    }
}
