using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public interface ILocalsRepository : IGenericRepository<Local>
    {
        //IEnumerable<Local> GetAll();
        //Local GetByID(decimal id);
        //void Insert(Local t);
        //void Delete(Local t);
        //void Update(Local t);
        //bool Exists(decimal Id);
        bool Exists(Local local);
        //void Save();

    }
}
