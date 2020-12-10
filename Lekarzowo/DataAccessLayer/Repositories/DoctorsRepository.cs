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
        public DoctorsRepository(ModelContext context) : base(context) {}

        public async Task<Doctor> GetDoctorWithSpecialization(decimal doctorId)
        {
            return await _context.Doctor.Include(x => x.Speciality).FirstOrDefaultAsync(doctor => doctor.Id == doctorId);
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

            var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }
    }
}
