﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IBaseRepository<T> where T : class
    {
        IEnumerable<T> GetAll();
        T GetByID(decimal id);
        void Insert(T t);
        void Delete(T t);
        void Update(T t);
        bool Exists(decimal Id);
        void Save();
    }
}
