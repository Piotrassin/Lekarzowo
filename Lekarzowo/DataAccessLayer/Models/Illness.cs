using System;
using System.Collections.Generic;

namespace Lekarzowo.DataAccessLayer.Models
{
    public partial class Illness : IEntity, INamedEntity
    {
        public Illness()
        {
            Illnesshistory = new HashSet<Illnesshistory>();
            Oldillnesshistory = new HashSet<Oldillnesshistory>();
        }

        public decimal Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Illnesshistory> Illnesshistory { get; set; }
        public virtual ICollection<Oldillnesshistory> Oldillnesshistory { get; set; }
    }
}
