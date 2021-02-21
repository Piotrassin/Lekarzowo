using Lekarzowo.DataAccessLayer.DTO;

namespace Lekarzowo.DataAccessLayer
{
    public interface IPersonRegistrationDTO : IPerson
    {
        PasswordDTO Password { get; set; }
    }
}
