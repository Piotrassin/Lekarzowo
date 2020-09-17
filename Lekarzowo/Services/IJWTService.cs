using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Services
{
    public interface IJWTService
    {
        string GenerateAccessToken(Person person);
        string GenerateRefreshToken(string currentToken);
    }
}
