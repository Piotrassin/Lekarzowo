using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class VisitsRepository : IVisitsRepository
    {
        private readonly ModelContext _context;
        public VisitsRepository(ModelContext context)
        {
            _context = context;
        }

        public void Delete(Visit t)
        {
            _context.Visit.Remove(t);
        }

        public bool Exists(decimal Id)
        {
            return _context.Visit.Any(x => x.ReservationId == Id);
        }

        public IEnumerable<Visit> GetAll()
        {
            return _context.Visit.ToList();
        }

        public Visit GetByID(decimal id)
        {
            return _context.Visit.Find(id);
        }

        public void Insert(Visit t)
        {
            _context.Visit.Add(t);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Update(Visit t)
        {
            _context.Visit.Attach(t);
            _context.Entry(t).State = EntityState.Modified;
        }

        public async Task<IEnumerable<View_VisitDetails>> DetailsView(decimal id)
        {
            return await _context.View_VisitDetails.Where(x => x.ReservationId == id).ToListAsync();
        }

        public async Task<IEnumerable<View_VisitList>> ListView(decimal PatientId)
        {
            return await _context.View_VisitList.Where(x => x.PatientId == PatientId).ToListAsync();
        }
    }
}
