using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class DoctorsRepository : GenericRepository<Doctor>, IDoctorsRepository
    {
        private readonly ModelContext _context;
        public DoctorsRepository(ModelContext context) : base(context)
        {
            this._context = context;
        }

        /// <summary>
        /// TODO: Czy istnieje już taki doktor? = czy istnieje już przypisanie Doctor - Osoba do Osoby o Id = doctor.IdNavigation?
        /// </summary>
        /// <param name="doctor"></param>
        /// <returns></returns>
        new public bool Exists(Doctor doctor)
        {
            return _context.Person.Any(x => x == doctor.IdNavigation);
        }
    }
}
