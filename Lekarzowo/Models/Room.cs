using System;
using System.Collections.Generic;

namespace Lekarzowo.Models
{
    public partial class Room
    {
        public Room()
        {
            Visit = new HashSet<Visit>();
        }

        public decimal Id { get; set; }
        public decimal Number { get; set; }
        public decimal LocalId { get; set; }

        public virtual Local Local { get; set; }
        public virtual ICollection<Visit> Visit { get; set; }
    }
}
