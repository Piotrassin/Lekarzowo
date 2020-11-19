using System;
using System.Collections.Generic;

namespace Lekarzowo.DataAccessLayer.Models
{
    public partial class Room : IEntity
    {
        public Room()
        {
            Reservation = new HashSet<Reservation>();
        }

        public decimal Id { get; set; }
        public decimal Number { get; set; }
        public decimal LocalId { get; set; }

        public virtual Local Local { get; set; }
        public virtual ICollection<Reservation> Reservation { get; set; }
    }
}
