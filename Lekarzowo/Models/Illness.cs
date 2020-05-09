using System;
using System.Collections.Generic;

namespace Lekarzowo.Models
{
    public partial class Illness
    {
        public Illness()
        {
            Illnesshistory = new HashSet<Illnesshistory>();
            Oldillnesshistory = new HashSet<Oldillnesshistory>();
        }

        public decimal Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public virtual ICollection<Illnesshistory> Illnesshistory { get; set; }
        public virtual ICollection<Oldillnesshistory> Oldillnesshistory { get; set; }
    }
}
