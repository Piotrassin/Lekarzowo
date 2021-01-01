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
    }
}