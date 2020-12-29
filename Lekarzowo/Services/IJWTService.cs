using System.Threading.Tasks;
using Lekarzowo.DataAccessLayer.Models;

namespace Lekarzowo.Services
{
    public interface IJWTService
    {
        Task<string> GenerateAccessToken(Person person, string activeRole);
        string GenerateRefreshToken(string currentToken);
    }
}
