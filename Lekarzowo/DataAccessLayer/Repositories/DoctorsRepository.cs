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
        /// Z powodu tego, że doctor nie ma pola Name, ta funkcja nie może nic zwracać, bo wybuchnie.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public bool Exists(string name)
        {
            //return false;            
            throw new NotImplementedException();
        }


        /// <summary>
        /// TODO: Czy istnieje już taki doktor? = czy istnieje już przypisanie Doctor - Osoba do Osoby o Id = doctor.IdNavigation?
        /// </summary>
        /// <param name="doctor"></param>
        /// <returns></returns>
        public bool Exists(Doctor doctor)
        {
            return _context.Person.Any(x => x == doctor.IdNavigation);
        }
    }
}
