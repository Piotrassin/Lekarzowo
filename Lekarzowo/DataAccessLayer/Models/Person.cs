using Lekarzowo.DataAccessLayer;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Lekarzowo.Models
{
    public partial class Person : IEntity, INamedEntity
    {
        public decimal Id { get; set; }
        public string Name { get; set; }
        public string Lastname { get; set; }
        public DateTime Birthdate { get; set; }
        public string Email { get; set; }

        //[JsonIgnore]
        public string Password { get; set; }
        public string Gender { get; set; }
        public string Pesel { get; set; }

        public virtual Doctor Doctor { get; set; }
        public virtual Patient Patient { get; set; }
    }
}
