using System;
using System.Collections.Generic;

namespace Lekarzowo.DataAccessLayer.Models
{
    public partial class Userroles
    {
        public decimal PersonId { get; set; }
        public decimal RoleId { get; set; }
        public DateTime Dateofissue { get; set; }

        public virtual Person Person { get; set; }
        public virtual Role Role { get; set; }
    }
}
