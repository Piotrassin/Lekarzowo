using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class DoctorsRepository : BaseRepository<Doctor>, IDoctorsRepository
    {
        //private readonly ModelContext _context;
        public DoctorsRepository(ModelContext context) : base(context)
        {
            //this._context = context;
        }

        /// <summary>
        /// TODO: Czy istnieje już taki doktor? = czy istnieje już przypisanie Doctor - Osoba do Osoby o Id = doctor.IdNavigation?
        /// </summary>
        /// <param name="doctor"></param>
        /// <returns></returns>
        public bool Exists(Doctor doctor)
        {
            return _context.Doctor.Any(x => x.IdNavigation.Id == doctor.Id && x.SpecialityId == doctor.SpecialityId);
        }

        public async Task<IEnumerable<object>> SearchByName(string name, string lastname)
        {
            return await _context.Doctor
                .Where(x => name == null || x.IdNavigation.Name.ToLower().Contains(name.ToLower()))
                .Where(x => lastname == null || x.IdNavigation.Lastname.ToLower().Contains(lastname.ToLower()))
                .Select(x => new
                {
                    x.Id,
                    x.IdNavigation.Name,
                    x.IdNavigation.Lastname,
                    SpecializationName = x.Speciality.Name,
                })
                .ToListAsync();
        }
    }
}
