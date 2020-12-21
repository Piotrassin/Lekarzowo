namespace Lekarzowo.DataAccessLayer.DTO
{
    public class PersonChangePasswordDTO
    {
        public string Email { get; set; }
        public PasswordDTO CurrentPassword { get; set; }
        public PasswordDTO NewPassword { get; set; }
        public PasswordDTO ConfirmPassword { get; set; }
    }
}
