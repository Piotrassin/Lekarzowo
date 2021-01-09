using System.Security.Claims;
using System.Threading.Tasks;
using Lekarzowo.DataAccessLayer.Models;

namespace Lekarzowo.Services
{
    public interface IJWTService
    {
        Task<string> GenerateAccessToken(Person person, string activeRole);
        Task<string> GenerateAccessTokenWithDefaultRole(Person person); 
        string GenerateRefreshToken();
        Task<bool> IsRefreshTokenValid(decimal userId, string refreshToken);
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
