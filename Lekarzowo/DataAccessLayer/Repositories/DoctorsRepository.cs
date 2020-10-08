using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    /// <summary>
    /// ORA-00904 "d.Name" invalid identifier
    /// Błąd obszedłem przez wycięcie implementacji IEntity przez klasę Doctor. Wtedy problem z atrybutem "Name" znika.
    /// </summary>
    public class DoctorsRepository : IDoctorsRepository
    {
        private readonly ModelContext _context;
        public DoctorsRepository(ModelContext context)
        {
            this._context = context;
        }

        public void Delete(Doctor doctor)
        {
            _context.Doctor.Remove(doctor);
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

        public bool Exists(decimal Id)
        {
            return _context.Doctor.Any(x => x.Id == Id);
        }

        public IEnumerable<Doctor> GetAll()
        {
            return _context.Doctor.Include(d => d.IdNavigation).ToList();
        }

        public Doctor GetByID(decimal id)
        {
            return _context.Doctor.Find(id);
        }

        public void Insert(Doctor doctor)
        {
            _context.Doctor.Add(doctor);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Update(Doctor doctor)
        {
            _context.Doctor.Attach(doctor);
            _context.Entry(doctor).State = EntityState.Modified;
        }
    }
}
