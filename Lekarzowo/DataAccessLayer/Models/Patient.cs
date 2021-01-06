using System;
using System.Collections.Generic;

namespace Lekarzowo.DataAccessLayer.Models
{
    public partial class Patient : IEntity
    {
        public Patient()
        {
            Oldillnesshistory = new HashSet<Oldillnesshistory>();
            Oldmedicinehistory = new HashSet<Oldmedicinehistory>();
            Reservation = new HashSet<Reservation>();
        }

        public decimal Id { get; set; }

        public virtual Person IdNavigation { get; set; }
        public virtual ICollection<Oldillnesshistory> Oldillnesshistory { get; set; }
        public virtual ICollection<Oldmedicinehistory> Oldmedicinehistory { get; set; }
        public virtual ICollection<Reservation> Reservation { get; set; }
    }
}
