﻿using System.Collections.Generic;

namespace Lekarzowo.DataAccessLayer.Models
{
    public partial class Doctor : IEntity
    {
        public Doctor()
        {
            Reservation = new HashSet<Reservation>();
            Workinghours = new HashSet<Workinghours>();
        }

        public decimal Id { get; set; }
        public decimal SpecialityId { get; set; }

        public virtual Person IdNavigation { get; set; }
        public virtual Speciality Speciality { get; set; }
        public virtual ICollection<Reservation> Reservation { get; set; }
        public virtual ICollection<Workinghours> Workinghours { get; set; }
    }
}
