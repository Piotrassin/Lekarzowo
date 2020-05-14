using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.Models;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitsController : ControllerBase
    {
        private readonly ModelContext _context;

        public VisitsController(ModelContext context)
        {
            _context = context;
        }

        // GET: api/Visits
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Visit>>> GetVisit()
        {
            return await _context.Visit.ToListAsync();
        }

        // GET: api/Visits/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Visit>> GetVisit(decimal id)
        {
            var visit = await _context.Visit.FindAsync(id);

            if (visit == null)
            {
                return NotFound();
            }

            return visit;
        }

        // PUT: api/Visits/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVisit(decimal id, Visit visit)
        {
            if (id != visit.ReservationId)
            {
                return BadRequest();
            }

            _context.Entry(visit).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VisitExists(id))
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

        // POST: api/Visits
        [HttpPost]
        public async Task<ActionResult<Visit>> PostVisit(Visit visit)
        {
            _context.Visit.Add(visit);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (VisitExists(visit.ReservationId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetVisit", new { id = visit.ReservationId }, visit);
        }

        // DELETE: api/Visits/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Visit>> DeleteVisit(decimal id)
        {
            var visit = await _context.Visit.FindAsync(id);
            if (visit == null)
            {
                return NotFound();
            }

            _context.Visit.Remove(visit);
            await _context.SaveChangesAsync();

            return visit;
        }

        private bool VisitExists(decimal id)
        {
            return _context.Visit.Any(e => e.ReservationId == id);
        }
    }
}
