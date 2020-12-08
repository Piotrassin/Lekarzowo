using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public interface IIllnessesHistoryRepository : IBaseRepository<Illnesshistory>
    {
        IEnumerable<Illnesshistory> GetAll(decimal PatientId);
        bool Exists(Illnesshistory illnesshistory);

        /// <summary>
        /// Most recent diagnosed illnesses of a given patient.
        /// </summary>
        /// <param name="patientId"></param>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> AllByPatientId(decimal patientId, int? limit, int? skip);

        /// <summary>
        /// Illnesses diagnosed on a given visit, ordered alphabetically.
        /// </summary>
        /// <param name="visitId"></param>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> AllByVisitId(decimal visitId, int? limit, int? skip);


    }
}
