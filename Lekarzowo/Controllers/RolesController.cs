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

        // GET: api/Roles?Name=abc
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Role>>> ListByName(string Name)
        {
            return Ok(await _repository.GetAllByName(Name));
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
                    //throw;
                    return StatusCode(503, e.Message);
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
                return Conflict("Role with that name already exists");
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

            _repository.Delete(role);
            _repository.Save();

            return role;
        }

        private bool RoleExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
