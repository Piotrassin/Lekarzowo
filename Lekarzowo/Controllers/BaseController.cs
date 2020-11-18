using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected decimal GetUserIdFromToken()
        {
            return decimal.Parse(this.User.Claims.First(x => x.Type == "UserId").Value);
        }
    }
}