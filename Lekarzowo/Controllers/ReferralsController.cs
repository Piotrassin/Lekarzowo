using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;

namespace Lekarzowo.Controllers
{
    //TODO: USUNĄĆ
    [Route("api/[controller]")]
    [ApiController]
    public class ReferralsController : ControllerBase
    {
        private readonly IReferralsRepository _repository;

        public ReferralsController(IReferralsRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Referrals
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Referral>>> GetReferral()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/Referrals/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Referral>> GetReferral(decimal id)
        {
            var referral = _repository.GetByID(id);

            if (referral == null)
            {
                return NotFound();
            }

            return referral;
        }

        // PUT: api/Referrals/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReferral(decimal id, Referral referral)
        {
            if (id != referral.Id)
            {
                return BadRequest();
            }

            if (_repository.GetByID(referral.Id) != null)
            {
                _repository.Update(referral);
            }

            try
            {
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                if (!ReferralExists(id))
                {
                    return NotFound();
                }

                return StatusCode(500, new JsonResult(e.Message));
            }

            return NoContent();
        }

        // POST: api/Referrals
        [HttpPost]
        public async Task<ActionResult<Referral>> PostReferral(Referral referral)
        {
            if (ReferralExists(referral.Id))
            {
                return Conflict(new JsonResult("That referral already exists"));
            }
            _repository.Insert(referral);
            _repository.Save();

            return Created("", referral);
        }

        // DELETE: api/Referrals/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Referral>> DeleteReferral(decimal id)
        {
            var referral = _repository.GetByID(id);
            if (referral == null)
            {
                return NotFound();
            }

            try
            {
                _repository.Delete(referral);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return referral;
        }

        private bool ReferralExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
