using System;
using System.Collections.Generic;

namespace Lekarzowo.DataAccessLayer.Models
{
    public partial class Speciality : IEntity, INamedEntity
    {
        public Speciality()
        {
            Doctor = new HashSet<Doctor>();
        }

        public decimal Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal DurationOfVisit { get; set; }

        public virtual ICollection<Doctor> Doctor { get; set; }
    }
}
