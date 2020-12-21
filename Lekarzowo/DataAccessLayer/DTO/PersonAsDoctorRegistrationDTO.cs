using Lekarzowo.DataAccessLayer.DTO;

namespace Lekarzowo.Validators.UserValidators
{
    public class PersonAsDoctorRegistrationDTO : PersonRegistrationDTO
    {
        public decimal SpecialityId { get; set; }
    }
}
