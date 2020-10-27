using Lekarzowo.Helpers;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Services
{
    public class AuthService
    {
        private readonly SecretSettings _settings;
        private static readonly int workFactor = 10;

        public AuthService(IOptions<SecretSettings> secretSettings)
        {
            _settings = secretSettings.Value;
        }

        public static string CreateHash(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, workFactor);
        }

        public static bool VerifyPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}
