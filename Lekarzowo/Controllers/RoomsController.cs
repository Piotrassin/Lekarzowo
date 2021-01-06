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

        // GET: api/rooms?limit=20&skip=0
        [Authorize(Roles = "doctor,admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetRoom(int? limit, int? skip)
        {
            return Ok(await _repository.GetAllWithLocalData(limit, skip));
        }

        // GET: api/Rooms/5
        [Authorize(Roles = "doctor,admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(decimal id)
        {
            var room = _repository.GetByID(id);

            if (room == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
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
                return BadRequest(BadRequestEmptyJsonResult);
            }
            if (!RoomExists(id))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            try
            {
                _repository.Update(room);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Ok(OkEmptyJsonResult);
        }

        // POST: api/Rooms
        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult<Room>> PostRoom(Room room)
        {
            if (await _repository.Exists(room))
            {
                return Conflict(ConflictJsonResult("That room already exists"));
            }

            room.Id = Decimal.Zero;
            try
            {
                _repository.Insert(room);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
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
                return NotFound(NotFoundEmptyJsonResult);
            }

            try
            {
                _repository.Delete(room);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return room;
        }

        private bool RoomExists(decimal id)
        {
            return _repository.Exists(id);
        }


    }
}
