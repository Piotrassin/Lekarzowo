using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserrolesController : ControllerBase
    {
        private readonly IStandardUserRolesRepository _repository;
        private readonly ICustomUserRolesService _rolesService;

        public UserrolesController(IStandardUserRolesRepository repository, ICustomUserRolesService roleService)
        {
            _repository = repository;
            _rolesService = roleService;
        }


        // GET: api/Userroles/GetNonStandard/1
        [HttpGet("[action]/{PersonId}")]
        public async Task<ActionResult<IEnumerable<String>>> GetNonStandard(decimal PersonId)
        {
            return Ok(_rolesService.GatherAllUserRoles(PersonId));
        }

        // GET: api/Userroles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Userroles>>> GetAllUserroles()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/Userroles/1
        [HttpGet("{PersonId}")]
        public async Task<ActionResult<IEnumerable<Userroles>>> GetAllUserroles(decimal PersonId)
        {
            return Ok(_repository.GetAll(PersonId));
        }

        // GET: api/Userroles/5/1
        [HttpGet("{PersonId}/{RoleId}")]
        public async Task<ActionResult<Userroles>> GetAllUserroles(decimal PersonId, decimal RoleId)
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

            try
            {
                _repository.Insert(userroles);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                if (UserrolesExists(userroles.PersonId, userroles.RoleId))
                {
                    return Conflict();
                }

                return StatusCode(500, e.Message);
            }

            return Created("", userroles);
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
