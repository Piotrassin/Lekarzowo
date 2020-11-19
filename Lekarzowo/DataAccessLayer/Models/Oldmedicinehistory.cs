using System;
using System.Collections.Generic;

namespace Lekarzowo.DataAccessLayer.Models
{
    public partial class Oldmedicinehistory
    {
        public decimal MedicineId { get; set; }
        public decimal PatientId { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }

        public virtual Medicine Medicine { get; set; }
        public virtual Patient Patient { get; set; }
    }
}
