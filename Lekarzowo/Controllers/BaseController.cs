using Lekarzowo.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Web.Http.Cors;
using Microsoft.AspNetCore.Cors;

namespace Lekarzowo.Controllers
{
    [Microsoft.AspNetCore.Cors.EnableCors]
    [Route("api/[controller]")]
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected decimal GetUserIdFromToken()
        {
            return decimal.Parse(this.User.Claims.First(x => x.Type == "UserId").Value);
        }

        protected String GetActiveRoleFromToken()
        {
            return User.Claims.First(x => x.Type == ClaimTypes.Role).Value;
        }

        protected bool IsAdmin()
        {
            return GetActiveRoleFromToken() == "admin";
        }

        protected bool IsDoctor()
        {
            return GetActiveRoleFromToken() == CustomUserRolesService.DoctorRoleName;
        }

        protected bool IsPatient()
        {
            return GetActiveRoleFromToken() == CustomUserRolesService.PatientRoleName;
        }

        /// <summary>
        /// Checks if a logged user is a patient and if passed patientId from given endpoint matches id in user's token.
        /// </summary>
        /// <param name="patientId"></param>
        /// <returns></returns>
        protected bool UserIsPatientAndDoesntHaveAccess(decimal patientId)
        {
            return IsPatient() && patientId != GetUserIdFromToken();
        }

        /// <summary>
        /// Checks if a logged user is a doctor and if passed doctorId from given endpoint matches id in user's token.
        /// </summary>
        /// <param name="doctorId"></param>
        /// <returns></returns>
        protected bool UserIsDoctorAndDoesntHaveAccess(decimal doctorId)
        {
            return IsDoctor() && doctorId != GetUserIdFromToken();
        }
    }
}