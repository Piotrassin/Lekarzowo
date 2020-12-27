using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Helpers;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Lekarzowo.Services
{
    public class JWTService : IJWTService
    {
        private readonly SecretSettings _settings;
        private readonly IStandardUserRolesRepository _standardUserRoles;

        public JWTService(IOptions<SecretSettings> secretSettings, IStandardUserRolesRepository roles)
        {
            _settings = secretSettings.Value;
            _standardUserRoles = roles;
        }



        public string GenerateAccessToken(Person person, string activeRole)
        {
            //TODO: Docelowo sekret do tworzenia podpisu powinien być pobierany z appsettings.json
            //var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_settings.Secret));

            //Dev
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("super sekretny sekret, którego nikt nie może nigdy poznać, bo przypał"));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var claims = new List<Claim>();
            claims.Add(new Claim("UserId", person.Id.ToString()));
            claims.Add(new Claim(ClaimTypes.Role, activeRole));

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateRefreshToken(string currentToken)
        {
            throw new NotImplementedException();
        }
    }
}
