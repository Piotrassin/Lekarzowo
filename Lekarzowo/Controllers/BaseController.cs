using Lekarzowo.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;

namespace Lekarzowo.Controllers
{
    [Microsoft.AspNetCore.Cors.EnableCors]
    [Route("api/[controller]")]
    [ApiController]
    public abstract class BaseController : ControllerBase
    {

        public decimal GetUserIdFromToken()
        {
            return decimal.Parse(this.User.Claims.First(x => x.Type == "UserId").Value);
        }

        public String GetActiveRoleFromToken()
        {
            return User.Claims.First(x => x.Type == ClaimTypes.Role).Value;
        }

        public bool IsAdmin()
        {
            return GetActiveRoleFromToken() == "admin";
        }

        public bool IsDoctor()
        {
            return GetActiveRoleFromToken() == CustomUserRolesService.DoctorRoleName;
        }

        public bool IsPatient()
        {
            return GetActiveRoleFromToken() == CustomUserRolesService.PatientRoleName;
        }

        /// <summary>
        /// Checks if a logged user is a patient and if passed patientId from given endpoint matches id in user's token.
        /// </summary>
        /// <param name="patientId"></param>
        /// <returns></returns>
        public bool UserIsPatientAndDoesntHaveAccess(decimal patientId)
        {
            return IsPatient() && patientId != GetUserIdFromToken();
        }

        /// <summary>
        /// Checks if a logged user is a doctor and if passed doctorId from given endpoint matches id in user's token.
        /// </summary>
        /// <param name="doctorId"></param>
        /// <returns></returns>
        public bool UserIsDoctorAndDoesntHaveAccess(decimal doctorId)
        {
            return IsDoctor() && doctorId != GetUserIdFromToken();
        }

        public bool UserIdMatches(decimal personId)
        {
            return personId == GetUserIdFromToken();
        }
    }
}