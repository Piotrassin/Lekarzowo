using Lekarzowo.DataAccessLayer;
using System;
using System.Collections.Generic;

namespace Lekarzowo.Models
{
    public partial class Local : IEntity, INamedEntity
    {
        public Local()
        {
            Room = new HashSet<Room>();
            Workinghours = new HashSet<Workinghours>();
        }

        public decimal Id { get; set; }
        public decimal CityId { get; set; }
        public string Name { get; set; }
        public string Streetname { get; set; }
        public string Postcode { get; set; }
        public decimal Streetnumber { get; set; }
        public string Blocknumber { get; set; }

        public virtual City City { get; set; }
        public virtual ICollection<Room> Room { get; set; }
        public virtual ICollection<Workinghours> Workinghours { get; set; }
    }
}
