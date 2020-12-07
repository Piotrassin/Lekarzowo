using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IUserInterfaceComponentsRepository
    {
        #region stare widoki
        Task<IEnumerable<object>> AddressData(decimal RoomId);
        Task<IEnumerable<object>> DoctorsAndSpecializations(decimal DoctorId);
        Task<IEnumerable<object>> DoctorsList(decimal? SpecializationId, decimal? CityId);
        Task<IEnumerable<object>> DoctorSchedule(decimal DoctorId, decimal LocalId);
        Task<IEnumerable<object>> IllnessAndMedicinesDetails(decimal PatientId, decimal IllnessId);
        Task<IEnumerable<object>> IllnessAndMedicinesList(decimal PatientId);
        Task<IEnumerable<object>> PatientIllnesses(decimal PatientId);
        Task<IEnumerable<object>> VisitDetails(decimal ReservationId);
        Task<IEnumerable<object>> VisitList(decimal PatientId);
        #endregion


        /// <summary>
        /// Most recent illnesses of a given patient.
        /// </summary>
        /// <param name="patientId"></param>
        
        /// <returns></returns>
        Task<IEnumerable<object>> IllnessesHistory(decimal patientId, int? limit, int? skip);

        /// <summary>
        /// Medicines prescribed during current visit
        /// </summary>
        /// <param name="visitId"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> PrescribedMedicines(decimal visitId, int? limit, int? skip);

        /// <summary>
        /// Treatments performed during current visit
        /// </summary>
        /// <param name="visitId"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> PerformedTreatments(decimal visitId, int? limit, int? skip);

        /// <summary>
        /// All medicines taken by the patient.
        /// </summary>
        /// <param name="patientId"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> TakenMedicines(decimal patientId, int? limit, int? skip);
    }
}
