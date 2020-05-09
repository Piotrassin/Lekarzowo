using System;
using System.Collections.Generic;

namespace Lekarzowo.Models
{
    public partial class City
    {
        public City()
        {
            Local = new HashSet<Local>();
        }

        public decimal Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Local> Local { get; set; }
    }
}
