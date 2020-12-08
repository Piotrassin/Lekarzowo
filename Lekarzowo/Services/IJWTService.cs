using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Services
{
    public interface IJWTService
    {
        string GenerateAccessToken(Person person, Role activeRole);
        string GenerateAccessToken(Person person, string activeRole);
        string GenerateRefreshToken(string currentToken);
    }
}
