using System;
using System.Collections.Generic;

namespace Lekarzowo.Models
{
    public partial class Doctor
    {
        public Doctor()
        {
            Referral = new HashSet<Referral>();
            Reservation = new HashSet<Reservation>();
            Workinghours = new HashSet<Workinghours>();
        }

        public decimal Id { get; set; }
        public decimal SpecialityId { get; set; }

        public virtual Person IdNavigation { get; set; }
        public virtual Speciality Speciality { get; set; }
        public virtual ICollection<Referral> Referral { get; set; }
        public virtual ICollection<Reservation> Reservation { get; set; }
        public virtual ICollection<Workinghours> Workinghours { get; set; }
    }
}
