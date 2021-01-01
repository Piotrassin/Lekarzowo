using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Helpers;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Lekarzowo.Services
{
    public class JWTService : IJWTService
    {
        private readonly SecretSettings _settings;
        private readonly IStandardUserRolesRepository _standardUserRoles;
        private readonly ICustomUserRolesService _customUserRolesService;


        public JWTService(IOptions<SecretSettings> secretSettings, IStandardUserRolesRepository roles, ICustomUserRolesService urolesService)
        {
            _settings = secretSettings.Value;
            _standardUserRoles = roles;
            _customUserRolesService = urolesService;
        }

        public async Task<string> GenerateAccessToken(Person person, string activeRole)
        {
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_settings.Secret));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var storedUserRoles = await _customUserRolesService.GatherAllUserRoles(person.Id);

            var claims = new List<Claim>();
            claims.Add(new Claim("UserId", person.Id.ToString()));
            claims.Add(new Claim(ClaimTypes.Role, activeRole));
            storedUserRoles.ForEach(role => claims.Add(new Claim("User roles", role)));

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(5),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateRefreshToken(string currentToken)
        {
            //var randomNum = new byte[16];

            //var generator1 = RandomNumberGenerator.Create();
            //generator1.GetBytes(randomNum);
            //return Convert.ToBase64String(randomNum);

            throw new NotImplementedException();
        }
    }
}
