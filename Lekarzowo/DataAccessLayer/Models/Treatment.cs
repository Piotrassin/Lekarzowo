﻿using System;
using System.Collections.Generic;

namespace Lekarzowo.DataAccessLayer.Models
{
    public partial class Treatment : IEntity, INamedEntity
    {
        public Treatment()
        {
            Referral = new HashSet<Referral>();
            Treatmentonvisit = new HashSet<Treatmentonvisit>();
        }

        public decimal Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }

        public virtual ICollection<Referral> Referral { get; set; }
        public virtual ICollection<Treatmentonvisit> Treatmentonvisit { get; set; }
    }
}
