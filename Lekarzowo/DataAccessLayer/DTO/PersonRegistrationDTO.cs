using System;

namespace Lekarzowo.DataAccessLayer.DTO
{
    public class PersonRegistrationDTO : IPersonRegistrationDTO
    {
        public string Name { get; set; }
        public string Lastname { get; set; }
        public DateTime Birthdate { get; set; }
        public string Email { get; set; }
        public PasswordDTO Password { get; set; }
        public string Gender { get; set; }
        public string Pesel { get; set; }
    }
}
