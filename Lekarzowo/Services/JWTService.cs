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


        public JWTService(IOptions<SecretSettings> secretSettings, IStandardUserRolesRepository roles, 
            ICustomUserRolesService urolesService, IPeopleRepository peopleRepository)
        {
            _settings = secretSettings.Value;
            _standardUserRoles = roles;
            _customUserRolesService = urolesService;
            _peopleRepository = peopleRepository;
            _key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_settings.Secret));
        }

        public async Task<string> GenerateAccessToken(Person person, string activeRole)
        {
            var credentials = new SigningCredentials(_key, _algorithm);
            var storedUserRoles = await _customUserRolesService.GatherAllUserRoles(person.Id);

            var claims = new List<Claim>();
            claims.Add(new Claim("UserId", person.Id.ToString()));
            claims.Add(new Claim(ClaimTypes.Role, activeRole));
            storedUserRoles.ForEach(role => claims.Add(new Claim("User roles", role)));

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(200),
                signingCredentials: credentials);

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
            //TODO zmienić losowy ciąg liczb na kolejny token szyfrowany, przechowujący czas trwania.
            var randomNum = new byte[16];
            var generator1 = RandomNumberGenerator.Create();
            generator1.GetBytes(randomNum);
            return Convert.ToBase64String(randomNum);
        }

        public async Task<bool> IsRefreshTokenValid(decimal userId, string refreshToken)
        {
            var user = _peopleRepository.GetByID(userId);
            return user.RefreshToken == refreshToken;
        }

        //TODO
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
                throw new SecurityTokenException();
            }

            return principal;
        }

    }
}
