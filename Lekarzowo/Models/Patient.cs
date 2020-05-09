using System;
using System.Collections.Generic;

namespace Lekarzowo.Models
{
    public partial class Patient
    {
        public Patient()
        {
            Illnesshistory = new HashSet<Illnesshistory>();
            Oldillnesshistory = new HashSet<Oldillnesshistory>();
            Oldmedicinehistory = new HashSet<Oldmedicinehistory>();
            Referral = new HashSet<Referral>();
            Reservation = new HashSet<Reservation>();
            Visit = new HashSet<Visit>();
        }

        public decimal Id { get; set; }

        public virtual Person IdNavigation { get; set; }
        public virtual ICollection<Illnesshistory> Illnesshistory { get; set; }
        public virtual ICollection<Oldillnesshistory> Oldillnesshistory { get; set; }
        public virtual ICollection<Oldmedicinehistory> Oldmedicinehistory { get; set; }
        public virtual ICollection<Referral> Referral { get; set; }
        public virtual ICollection<Reservation> Reservation { get; set; }
        public virtual ICollection<Visit> Visit { get; set; }
    }
}
