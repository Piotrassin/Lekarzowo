using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface ISQLPerspectivesRepository
    {
        Task<IEnumerable<View_AddressData>> AddressData(decimal RoomId);
        Task<IEnumerable<View_DocsAndSpecs>> DoctorsAndSpecializations(decimal DoctorId);
        Task<IEnumerable<View_DoctorList>> DoctorsList(decimal SpecializationId, decimal CityId);
        Task<IEnumerable<View_DoctorSchedule>> DoctorSchedule(decimal DoctorId, decimal LocalId);
        Task<IEnumerable<View_IllnessMedDetails>> IllnessAndMedicinesDetails(decimal PatientId, decimal IllnessId);
        Task<IEnumerable<View_IllnessMedList>> IllnessAndMedicinesList(decimal PatientId);
        Task<IEnumerable<View_PatientIllnesses>> PatientIllnesses(decimal PatientId);
        Task<IEnumerable<Object>> VisitDetails(decimal ReservationId);
        Task<IEnumerable<View_VisitList>> VisitList(decimal PatientId);
    }
}
