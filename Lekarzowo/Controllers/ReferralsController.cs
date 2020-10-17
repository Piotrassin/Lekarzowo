﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Controllers
{
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
            catch (DbUpdateConcurrencyException)
            {
                if (!ReferralExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Referrals
        [HttpPost]
        public async Task<ActionResult<Referral>> PostReferral(Referral referral)
        {
            if (ReferralExists(referral.Id))
            {
                return Conflict("That referral already exists");
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

            _repository.Delete(referral);
            _repository.Save();

            return referral;
        }

        private bool ReferralExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
