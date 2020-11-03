using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.DTO
{
    public class PersonDTO
    {
        public string Name { get; set; }
        public string Lastname { get; set; }
        public DateTime Birthdate { get; set; }
        public string Email { get; set; }

        //[JsonIgnore]
        public string Password { get; set; }
        public string Gender { get; set; }
        public string Pesel { get; set; }
    }
}
