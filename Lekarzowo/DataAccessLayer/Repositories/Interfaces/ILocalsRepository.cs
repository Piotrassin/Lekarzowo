using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public interface ILocalsRepository : IBaseRepository<Local>
    {
        bool Exists(Local local);
        //Task<IEnumerable<View_AddressData>> DetailsView(decimal RoomId);
    }
}
