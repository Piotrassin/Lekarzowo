using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using Lekarzowo.Services;
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

        public async Task<IEnumerable<object>> GetAllByNameOrLastname(string name, int? skip, int? limit)
        {
            var query = _context.Doctor
                .Where(x => name == null || (x.IdNavigation.Name.ToLower().Contains(name.ToLower()) || x.IdNavigation.Lastname.ToLower().Contains(name.ToLower())))
                .Select(x => new
                {
                    x.Id,
                    x.IdNavigation.Name,
                    x.IdNavigation.Lastname,
                    SpecializationName = x.Speciality.Name,
                }).OrderBy(x => x.Name);

            var orderedQuery = PaginationService.SplitAndLimit(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }
    }
}
