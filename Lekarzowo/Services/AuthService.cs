namespace Lekarzowo.Services
{
    public class AuthService
    {
        private static readonly int workFactor = 10;

        public AuthService() { }

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
