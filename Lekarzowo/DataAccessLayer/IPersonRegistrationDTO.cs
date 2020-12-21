using Lekarzowo.DataAccessLayer.DTO;
using System;

namespace Lekarzowo.DataAccessLayer
{
    public interface IPersonRegistrationDTO : IPerson
    {
        PasswordDTO Password { get; set; }
    }
}
