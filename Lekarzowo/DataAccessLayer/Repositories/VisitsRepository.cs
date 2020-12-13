using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;

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
            return _context.Visit.ToList().OrderBy(x => x.ReservationId);
        }

        public Visit GetByID(decimal id)
        {
            return _context.Visit.Find(id);
        }

        public void Update(Visit t)
        {
            //_context.Visit.Attach(t);
            var entry = _table.First(e => e.ReservationId == t.ReservationId);
            Update(t, entry);
        }

    }
}
