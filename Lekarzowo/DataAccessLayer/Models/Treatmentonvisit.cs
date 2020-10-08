using Lekarzowo.DataAccessLayer;
using System;
using System.Collections.Generic;

namespace Lekarzowo.Models
{
    public partial class Treatmentonvisit
    {
        public decimal Id { get; set; }
        public decimal TreatmentId { get; set; }
        public decimal VisitId { get; set; }
        public string Description { get; set; }

        public virtual Treatment Treatment { get; set; }
        public virtual Visit Visit { get; set; }
    }
}
