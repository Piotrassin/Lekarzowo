using System;

namespace Lekarzowo.DataAccessLayer
{
    public interface IPerson : INamedEntity
    {
       string Name { get; set; }
       string Lastname { get; set; }
       DateTime Birthdate { get; set; }
       string Email { get; set; }
       string Gender { get; set; }
       string Pesel { get; set; }
    }
}
