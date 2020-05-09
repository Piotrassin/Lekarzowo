﻿using System;
using System.Collections.Generic;

namespace Lekarzowo.Models
{
    public partial class Medicine
    {
        public Medicine()
        {
            Medicinehistory = new HashSet<Medicinehistory>();
            Oldmedicinehistory = new HashSet<Oldmedicinehistory>();
        }

        public decimal Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Medicinehistory> Medicinehistory { get; set; }
        public virtual ICollection<Oldmedicinehistory> Oldmedicinehistory { get; set; }
    }
}
