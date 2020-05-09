using System;
using System.Collections.Generic;

namespace Lekarzowo.Models
{
    public partial class Treatment
    {
        public Treatment()
        {
            Referral = new HashSet<Referral>();
        }

        public decimal Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public DateTime Time { get; set; }

        public virtual Treatmentonvisit Treatmentonvisit { get; set; }
        public virtual ICollection<Referral> Referral { get; set; }
    }
}
