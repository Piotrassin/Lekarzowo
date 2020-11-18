using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserrolesController : ControllerBase
    {
        private readonly IUserRolesRepository _repository;
        public UserrolesController(IUserRolesRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Userroles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Userroles>>> GetUserroles()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/Userroles/1
        [HttpGet("{PersonId}")]
        public async Task<ActionResult<IEnumerable<Userroles>>> GetUserroles(decimal PersonId)
        {
            return Ok(_repository.GetAll(PersonId));
        }

        // GET: api/Userroles/5/1
        [HttpGet("{PersonId}/{RoleId}")]
        public async Task<ActionResult<Userroles>> GetUserroles(decimal PersonId, decimal RoleId)
        {
            var userroles = _repository.GetByID(PersonId, RoleId);

            if (userroles == null)
            {
                return NotFound();
            }

            return userroles;
        }

        /// <summary>
        /// Edytowanie przypisanych ról do użytkownika w sumie nie ma sensu, bo i tak nie powinno się zmieniać dat,
        /// a RoleId i PersonId są częścią klucza głównego, więc ich też nie powinno się/nie można ruszać.
        /// </summary>
        /// <param name="PersonId"></param>
        /// <param name="RoleId"></param>
        /// <param name="inputUserRole"></param>
        /// <returns></returns>
        ////PUT: api/Userroles/5/2
        //[HttpPut("{PersonId}/{RoleId}")]
        //public async Task<IActionResult> PutUserroles(decimal PersonId, decimal RoleId, Userroles inputUserRole)
        //{
        //    if (PersonId != inputUserRole.PersonId)
        //    {
        //        return BadRequest();
        //    }
        //    if (UserrolesExists(PersonId, RoleId))
        //    {
        //        var storedUserRole = _repository.GetByID(PersonId, RoleId);
        //        storedUserRole.RoleId = inputUserRole.RoleId;
        //        _repository.Update(inputUserRole);
        //        try
        //        {
        //            _repository.Save();
        //            return Ok();
        //        }
        //        catch (DbUpdateConcurrencyException e)
        //        {
        //            //throw;
        //            return StatusCode(503, e.Message);
        //        }
        //    }

        //    return NotFound();
        //}

        // POST: api/Userroles
        [HttpPost]
        public async Task<ActionResult<Userroles>> PostUserroles(Userroles userroles)
        {
            if(userroles.Dateofissue == DateTime.MinValue || userroles.Dateofissue == null)
            {
                userroles.Dateofissue = DateTime.Now;
            }

            _repository.Insert(userroles);

            try
            {
                _repository.Save();
            }
            catch (DbUpdateException)
            {
                if (UserrolesExists(userroles.PersonId, userroles.RoleId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserroles", new { id = userroles.PersonId }, userroles);
        }

        // DELETE: api/Userroles/5
        [HttpDelete("{PersonId}/{RoleId}")]
        public async Task<ActionResult<Userroles>> DeleteUserroles(decimal PersonId, decimal RoleId)
        {
            var userroles = _repository.GetByID(PersonId, RoleId);
            if (userroles == null)
            {
                return NotFound();
            }

            _repository.Delete(userroles);
            _repository.Save();

            return userroles;
        }

        private bool UserrolesExists(decimal PersonId, decimal RoleId)
        {
            return _repository.Exists(PersonId, RoleId);
        }
    }
}
