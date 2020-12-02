using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IWorkingHoursRepository : IBaseRepository<Workinghours>
    {

        /// <summary>
        /// Returns first object that meets given criteria or null otherwise.
        /// </summary>
        /// <param name="DocId"></param>
        /// <param name="LocId"></param>
        /// <param name="date"></param>
        /// <returns></returns>
        Task<Workinghours> GetByDetails(decimal DocId, decimal LocId, DateTime date);

        /// <summary>
        /// Returns all working hours newer than current date.
        /// </summary>
        /// <param name="CityId"></param>
        /// <param name="SpecId"></param>
        /// <param name="DoctorId"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        IEnumerable<Workinghours> GetAllFutureWorkHours(decimal? CityId, decimal? SpecId, decimal? DoctorId, DateTime? start, DateTime? end);
        
        /// <summary>
        /// Returns true if a workingHours object with the same DoctorID, LocalID, start and finish dates already exists in db.
        /// </summary>
        /// <param name="workHours"></param>
        /// <returns></returns>
        Task<bool> Exists(Workinghours workHours);

        /// <summary>
        /// Returns true if passed Workinghours object overlaps with existing workinghours of a given doctor.
        /// </summary>
        /// <param name="wh"></param>
        /// <returns></returns>
        Task<bool> IsWorkingHourOverlapping(Workinghours wh);
    }
}
