using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public interface IIllnessesRepository : IBaseNameRepository<Illness>
    {
        /// <summary>
        /// Dynamically searches illnesses by their name but only among those diagnosed on a given visit.
        /// </summary>
        /// <param name="visitId"></param>
        /// <param name="name"></param>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        Task<IEnumerable<Illness>> AllByNameOnVisit(decimal visitId, string name, int? limit, int? skip);
    }
}
