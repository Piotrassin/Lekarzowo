using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class IllnessesHistoryRepository : IIllnessesHistoryRepository
    {
        private readonly ModelContext _context;

        public IllnessesHistoryRepository(ModelContext context)
        {
            this._context = context;
        }

        public void Delete(Illnesshistory t)
        {
            _context.Remove(t);
        }

        public bool Exists(decimal Id)
        {
            return _context.Illnesshistory.Any(x => x.Id == Id);
        }

        public bool Exists(Illnesshistory t)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Illnesshistory> GetAll()
        {
            return _context.Illnesshistory.ToList();
        }

        public Illnesshistory GetByID(decimal id)
        {
            return _context.Illnesshistory.Find(id);
        }

        public void Insert(Illnesshistory t)
        {
            _context.Illnesshistory.Add(t);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Update(Illnesshistory t)
        {
            _context.Illnesshistory.Attach(t);
            _context.Entry(t).State = EntityState.Modified;
        }
    }
}
