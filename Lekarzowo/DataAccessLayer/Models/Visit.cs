using System;
using System.Collections.Generic;

namespace Lekarzowo.DataAccessLayer.Models
{
    public partial class Visit
    {
        public Visit()
        {
            Illnesshistory = new HashSet<Illnesshistory>();
            Treatmentonvisit = new HashSet<Treatmentonvisit>();
        }

        public decimal ReservationId { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public decimal OnGoing { get; set; }

        public virtual Reservation Reservation { get; set; }
        public virtual ICollection<Illnesshistory> Illnesshistory { get; set; }
        public virtual ICollection<Treatmentonvisit> Treatmentonvisit { get; set; }
    }
}
