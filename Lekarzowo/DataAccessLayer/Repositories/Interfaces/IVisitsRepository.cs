﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Lekarzowo.DataAccessLayer.Models;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IVisitsRepository : IBaseIdRepository<Visit>
    {
        /// <summary>
        /// Checks if any other visit of a given doctor is ongoing.
        /// </summary>
        /// <param name="doctorId"></param>
        /// <returns></returns>
        Task<IEnumerable<Visit>> OnGoingVisitsToday(decimal doctorId);

        /// <summary>
        /// Returns details of an ongoin visit if the is any.
        /// </summary>
        /// <param name="doctorId"></param>
        /// <returns></returns>
        Task<Visit> OnGoingVisit(decimal doctorId);
    }
}
