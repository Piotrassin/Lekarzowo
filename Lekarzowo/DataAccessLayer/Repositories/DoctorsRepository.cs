using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Services;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class DoctorsRepository : BaseIdRepository<Doctor>, IDoctorsRepository
    {
        public DoctorsRepository(ModelContext context) : base(context) {}

        public object DoctorsContactData(decimal doctorId)
        {
            return _context.Person.Where(x => x.Doctor.Id == doctorId)
                .Select(x => new
                {
                    Name = x.Name,
                    Lastname = x.Lastname,
                    Email = x.Email
                });
        }

        public async Task<Doctor> GetByIdWithSpecialization(decimal doctorId)
        {
            return await _context.Doctor.Select(x => new Doctor()
            {
                Id = x.Id,
                SpecialityId = x.SpecialityId,
                Speciality = new Speciality()
                {
                    Id = x.Speciality.Id,
                    Name = x.Speciality.Name,
                    Price = x.Speciality.Price
                }
                
            }).FirstOrDefaultAsync(x => x.Id == doctorId);
        }

        public async Task<IEnumerable<object>> GetAllByNameOrLastname(string name, int? limit, int? skip)
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
