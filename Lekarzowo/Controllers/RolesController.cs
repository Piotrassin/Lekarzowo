using System;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRolesRepository _repository;

        public RolesController(IRolesRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Roles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Role>>> GetRole()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/Roles/AllByName?Name=abc&limit=0&skip=0
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Role>>> AllByName(string name, int? limit, int? skip)
        {
            return Ok(await _repository.GetAllByName(name, limit, skip));
        }


        // GET: api/Roles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Role>> GetRole(decimal id)
        {
            var role = _repository.GetByID(id);

            if (role == null)
            {
                return NotFound();
            }

            return role;
        }

        // PUT: api/Roles/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRole(decimal id, Role role)
        {
            if (id != role.Id)
            {
                return BadRequest();
            }

            if (RoleExists(id))
            {
                var storedRole = _repository.GetByID(role.Id);
                storedRole.Name = role.Name;
                _repository.Update(storedRole);

                try
                {
                    _repository.Save();
                    return Ok();
                }
                catch (DbUpdateConcurrencyException e)
                {
                    return StatusCode(500, new JsonResult(e.Message));
                }
            }
            return NotFound();
        }

        // POST: api/Roles
        [HttpPost]
        public async Task<ActionResult<Role>> PostRole(Role role)
        {
            var storedRole = await _repository.GetSingleByName(role.Name);
            if (storedRole != null)
            {
                return Conflict(new JsonResult("Rola o tej nazwie już istnieje."));
            }
            _repository.Insert(role);
            _repository.Save();

            return Created("", role);
        }

        // DELETE: api/Roles/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Role>> DeleteRole(decimal id)
        {
            var role = _repository.GetByID(id);
            if(role == null)
            {
                return NotFound();
            }

            try
            {
                _repository.Delete(role);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return role;
        }

        private bool RoleExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
