using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IVisitsRepository : IBaseRepository<Visit>
    {
        Task<IEnumerable<View_VisitDetails>> DetailsView(decimal ReservationId);
        Task<IEnumerable<View_VisitList>> ListView(decimal PatientId);
    }
}
