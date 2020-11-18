using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.DTO
{
    public class UserChangePasswordDTO
    {
        public string Email { get; set; }
        public PasswordDTO CurrentPassword { get; set; }
        public PasswordDTO NewPassword { get; set; }
        public PasswordDTO ConfirmPassword { get; set; }
    }
}
