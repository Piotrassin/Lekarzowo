using Lekarzowo.DataAccessLayer.Models;

namespace Lekarzowo.Services
{
    public interface IJWTService
    {
        string GenerateAccessToken(Person person, Role activeRole);
        string GenerateAccessToken(Person person, string activeRole);
        string GenerateRefreshToken(string currentToken);
    }
}
