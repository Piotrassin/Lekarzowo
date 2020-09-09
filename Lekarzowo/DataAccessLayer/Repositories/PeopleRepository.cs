using Lekarzowo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Repositories
{
    public class PeopleRepository : IDisposable, IPeopleRepository
    {
        private bool disposed = false;
        private readonly ModelContext _context;

        public PeopleRepository(ModelContext context)
        {
            this._context = context;
        }

        public IEnumerable<Person> GetAll()
        {
            return _context.Person.ToList();
        }

        //public Student GetStudentByID(int id)
        //{
        //    return _context.Students.Find(id);
        //}

        //public void InsertStudent(Student student)
        //{
        //    _context.Students.Add(student);
        //}

        //public void DeleteStudent(int studentID)
        //{
        //    Student student = _context.Students.Find(studentID);
        //    _context.Students.Remove(student);
        //}

        //public void UpdateStudent(Student student)
        //{
        //    _context.Entry(student).State = EntityState.Modified;
        //}

        //public void Save()
        //{
        //    _context.SaveChanges();
        //}


        #region Disposing
        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        #endregion



        //IEnumerable<Person> IPeopleRepository.GetAll()
        //{
        //    throw new NotImplementedException();
        //}

        public Person GetByID(int personID)
        {
            throw new NotImplementedException();
        }

        public void Insert(Person person)
        {
            throw new NotImplementedException();
        }

        public void Delete(int personID)
        {
            throw new NotImplementedException();
        }

        public void Update(Person person)
        {
            throw new NotImplementedException();
        }

        void IPeopleRepository.Dispose(bool disposing)
        {
            throw new NotImplementedException();
        }


    }
}
