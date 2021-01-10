using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Helpers;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Lekarzowo.Repositories;

namespace Lekarzowo.Services
{
    public class JWTService : IJWTService
    {
        private readonly SecretSettings _settings;
        private readonly IStandardUserRolesRepository _standardUserRoles;
        private readonly ICustomUserRolesService _customUserRolesService;
        private readonly IPeopleRepository _peopleRepository;
        private readonly SymmetricSecurityKey _key;
        private const string _algorithm = SecurityAlgorithms.HmacSha256Signature;
        private readonly SigningCredentials _credentials;
        private const char delimiter = '.';


        public JWTService(IOptions<SecretSettings> secretSettings, IStandardUserRolesRepository roles, 
            ICustomUserRolesService urolesService, IPeopleRepository peopleRepository)
        {
            _settings = secretSettings.Value;
            _standardUserRoles = roles;
            _customUserRolesService = urolesService;
            _peopleRepository = peopleRepository;
            _key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_settings.Secret));
            _credentials = new SigningCredentials(_key, _algorithm);
        }

        public async Task<string> GenerateAccessToken(Person person, string activeRole)
        {
            var storedUserRoles = await _customUserRolesService.GatherAllUserRoles(person.Id);

            var claims = new List<Claim>();
            claims.Add(new Claim("UserId", person.Id.ToString()));
            claims.Add(new Claim(ClaimTypes.Role, activeRole));
            storedUserRoles.ForEach(role => claims.Add(new Claim("User roles", role)));

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: _credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<string> GenerateAccessTokenWithDefaultRole(Person person)
        {
            string token = "";
            var storedUserRoles = await _customUserRolesService.GatherAllUserRoles(person.Id);
            if (storedUserRoles.Any())
            {
                token = await GenerateAccessToken(person, storedUserRoles.First());
            }

            return token;
        }

        public string GenerateRefreshToken()
        {
            //TODO Dokończyć.

            var randomNum = new byte[64];
            var generator1 = RandomNumberGenerator.Create();
            generator1.GetBytes(randomNum);
            var expDate = ParseDateForTokenUse(DateTime.Now.AddDays(1));
            var dateBytes = Encoding.ASCII.GetBytes(expDate);
            var payload = dateBytes.Concat(randomNum);
            return Convert.ToBase64String(payload.ToArray());
        }

        public async Task<bool> IsRefreshTokenValid(decimal userId, string refreshToken)
        {
           var user = _peopleRepository.GetByID(userId);
           if (user.RefreshToken != refreshToken)
           {
               return false;
           }

           var dateFromToken = ParseTokenToDate(refreshToken);
           if (dateFromToken < DateTime.Now)
           {
               UpdateRefreshToken(user, "");
               return false;
           }

           return true;
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParams = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                ValidateLifetime = false,
                IssuerSigningKey = _key,
                ValidateIssuer = false,
                ValidateAudience = false
            };

            SecurityToken tokenToValidate;
            var principal = new JwtSecurityTokenHandler().ValidateToken(token, tokenValidationParams, out tokenToValidate);
            var jwtSecurityToken = tokenToValidate as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(_algorithm, StringComparison.InvariantCultureIgnoreCase))
            {
                return null;
            }

            return principal;
        }

        private DateTime ParseTokenToDate(string token)
        {
            var dateString = Encoding.UTF8.GetString(Convert.FromBase64String(token)).Substring(0, 16); 
            var dateArray = dateString.Split(delimiter);

            return new DateTime(
                Convert.ToInt32(dateArray[0]), 
                Convert.ToInt32(dateArray[1]), 
                Convert.ToInt32(dateArray[2]), 
                Convert.ToInt32(dateArray[3]), 
                Convert.ToInt32(dateArray[4]),
                0);
        }

        private string ParseDateForTokenUse(DateTime expDate)
        {
            return expDate.ToString("yyyy") + delimiter + 
                   expDate.ToString("MM") + delimiter + 
                   expDate.ToString("dd") + delimiter + 
                   expDate.ToString("HH") + delimiter + 
                   expDate.ToString("mm");
        }

        private async Task UpdateRefreshToken(Person person, string refreshToken)
        {
            person.RefreshToken = refreshToken;
            _peopleRepository.Update(person);
            _peopleRepository.Save();
        }
    }
}
