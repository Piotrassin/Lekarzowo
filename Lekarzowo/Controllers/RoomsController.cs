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
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : BaseController
    {
        private readonly IRoomsRepository _repository;

        public RoomsController(IRoomsRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Rooms
        [Authorize(Roles = "doctor,admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetRoom()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/Rooms/5
        [Authorize(Roles = "doctor,admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(decimal id)
        {
            var room = _repository.GetByID(id);

            if (room == null)
            {
                return NotFound(new JsonResult(""));
            }

            return room;
        }

        // GET: api/Rooms/AllByRoomNumber?localId=1&roomNumber=110
        [Authorize(Roles = "doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Room>>> AllByRoomNumber(decimal localId, decimal? roomNumber)
        {
            return Ok(await _repository.AllByRoomNumber(localId, roomNumber));
        }

        // PUT: api/Rooms/5
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoom(decimal id, Room room)
        {
            if (id != room.Id)
            {
                return BadRequest(new JsonResult(""));
            }
            if (!RoomExists(id))
            {
                return NotFound(new JsonResult(""));
            }

            try
            {
                _repository.Update(room);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return Ok(new JsonResult(""));
        }

        // POST: api/Rooms
        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult<Room>> PostRoom(Room room)
        {
            if (await _repository.Exists(room))
            {
                return Conflict(new JsonResult("That room already exists"));
            }

            room.Id = Decimal.Zero;
            try
            {
                _repository.Insert(room);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return Created("", room);
        }

        // DELETE: api/Rooms/5
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Room>> DeleteRoom(decimal id)
        {
            var room = _repository.GetByID(id);
            if (room == null)
            {
                return NotFound(new JsonResult(""));
            }

            try
            {
                _repository.Delete(room);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return room;
        }

        private bool RoomExists(decimal id)
        {
            return _repository.Exists(id);
        }


    }
}
