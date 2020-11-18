using System;
using System.Collections.Generic;

namespace Lekarzowo.DataAccessLayer.Models
{
    public partial class Role : IEntity, INamedEntity
    {
        public Role()
        {
            Userroles = new HashSet<Userroles>();
        }

        public decimal Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Userroles> Userroles { get; set; }
    }
}
