using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.DTO
{
    public class UserLoginDTO
    {
        public string Email { get; set; }
        public PasswordDTO Password { get; set; }
    }
}
