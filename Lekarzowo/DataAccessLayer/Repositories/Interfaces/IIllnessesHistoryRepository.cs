using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public interface IIllnessesHistoryRepository : IBaseIdRepository<Illnesshistory>
    {
        /// <summary>
        /// Returns a list of full IllnessHistory objects belonging to a given patient.
        /// </summary>
        /// <param name="patientId"></param>
        /// <returns></returns>
        IEnumerable<Illnesshistory> GetAll(decimal patientId);

        /// <summary>
        /// Returns a list of objects belonging to a given patient, which consist of IllnessHistori objects, but with additional info.
        /// </summary>
        /// <param name="patientId"></param>
        /// <returns></returns>
        IEnumerable<object> GetAllWithAdditionalInfo(decimal patientId);

        /// <summary>
        /// List of all illnessHistory objects with a given visitId.
        /// </summary>
        /// <param name="visitId"></param>
        /// <returns></returns>
        Task<IEnumerable<Illnesshistory>> GetByVisitId(decimal visitId);

        /// <summary>
        /// Returns shortened versions of objects of most recent diagnosed illnesses of a given patient.
        /// </summary>
        /// <param name="patientId"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> PatientHistory(decimal patientId);

        /// <summary>
        /// Illnesses diagnosed on a given visit, ordered alphabetically.
        /// </summary>
        /// <param name="visitId"></param>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> AllByVisitId(decimal visitId, int? limit, int? skip);

        /// <summary>
        /// Illnesses diagnosed on given visit searchable by their name attribute.
        /// </summary>
        /// <param name="visitId"></param>
        /// <param name="name"></param>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> AllByNameOnVisit(decimal visitId, string name, int? limit, int? skip);

    }
}
