using Lekarzowo.DataAccessLayer.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IWorkingHoursRepository : IBaseIdRepository<Workinghours>
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
        /// Returns a list of all locals where a given doctor works.
        /// </summary>
        /// <param name="doctorId"></param>
        /// <returns></returns>
        Task<IEnumerable<Local>> DoctorsWorkplaces(decimal doctorId);

        /// <summary>
        /// Dynamic search of all locals which names containt given phrase. Optionally can be narrowed down to only those where given doctor works.
        /// </summary>
        /// <param name="localName"></param>
        /// <param name="doctorId"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> DoctorsWorkplacesByName(string localName, decimal? doctorId, int? limit, int? skip);

        /// <summary>
        /// List of nearest working hours in a given local. e.g. days = 7, nearest 7 workinghours objects for that doctor and local are returned.
        /// </summary>
        /// <param name="doctorId"></param>
        /// <param name="localId"></param>
        /// <param name="days"></param>
        /// <returns></returns>
        Task<IEnumerable<Workinghours>> DoctorUpcomingWorkingHours(decimal doctorId, decimal localId, int days);

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
        /// <param name="newHours"></param>
        /// <returns></returns>
        Task<IEnumerable<Workinghours>> IsWorkingHourOverlapping(Workinghours newHours);
    }
}
