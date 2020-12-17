using System;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class VisitsRepository : BaseCRUDRepository<Visit>, IVisitsRepository
    {
        public VisitsRepository(ModelContext context) : base(context) { }

        public bool Exists(decimal Id)
        {
            return _context.Visit.Any(x => x.ReservationId == Id);
        }

        public new IEnumerable<Visit> GetAll()
        {
            return _context.Visit.Include(x => x.Reservation).ToList().OrderBy(x => x.ReservationId);
        }

        public Visit GetByID(decimal id)
        {
            return _context.Visit.Include(x => x.Reservation).FirstOrDefault(x => x.ReservationId == id);
        }

        public void Update(Visit t)
        {
            var entry = _table.First(e => e.ReservationId == t.ReservationId);
            Update(t, entry);
        }

        public async Task<IEnumerable<Visit>> OnGoingVisitsToday(decimal doctorId)
        {
            return await _context.Visit
                .Where(x => x.Reservation.Starttime.Date == DateTime.Now.Date)
                .Where(x => x.Reservation.DoctorId == doctorId && x.OnGoing)
                .ToListAsync();
        }

        public async Task<Visit> OnGoingVisit(decimal doctorId)
        {
            return await _context.Visit
                .Where(x => x.Reservation.Starttime.Date == DateTime.Now.Date)
                .Where(x => x.Reservation.DoctorId == doctorId && x.OnGoing)
                .FirstOrDefaultAsync();
        }
    }
}
