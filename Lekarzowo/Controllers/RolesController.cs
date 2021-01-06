using System;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Lekarzowo.Controllers
{
    [Authorize(Roles = "admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : BaseController
    {
        private readonly IRolesRepository _repository;

        public RolesController(IRolesRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Roles
        [AllowAnonymous]    //TODO do usunięcia po zakończeniu testowania programu
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
                return NotFound(NotFoundEmptyJsonResult);
            }

            return role;
        }

        // PUT: api/Roles/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRole(decimal id, Role role)
        {
            if (id != role.Id)
            {
                return BadRequest(BadRequestEmptyJsonResult);
            }

            if (!RoleExists(id))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            var storedRole = _repository.GetByID(role.Id);
            storedRole.Name = role.Name;

            try
            {
                _repository.Update(storedRole);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return NotFound(NotFoundEmptyJsonResult);
        }

        // POST: api/Roles
        [HttpPost]
        public async Task<ActionResult<Role>> PostRole(Role role)
        {
            var storedRole = await _repository.GetSingleByName(role.Name);
            if (storedRole != null)
            {
                return Conflict(ConflictJsonResult("Role with that name already exist"));
            }

            role.Id = Decimal.Zero;
            try
            {
                _repository.Insert(role);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Created("", role);
        }

        // DELETE: api/Roles/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Role>> DeleteRole(decimal id)
        {
            var role = _repository.GetByID(id);
            if(role == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            try
            {
                _repository.Delete(role);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return role;
        }

        private bool RoleExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
