using Lekarzowo.Controllers;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System.Threading.Tasks;

namespace Lekarzowo.Services
{
    public class AuthorizationService
    {
        private readonly IVisitsRepository _visitsRepository;
        private readonly IIllnessesHistoryRepository _illnessesHistoryRepository; 
        private readonly IReservationsRepository _reservationsRepository;

        public AuthorizationService(IIllnessesHistoryRepository illnessesHistoryRepository,
            IVisitsRepository visitsRepository, IReservationsRepository reservationsRepository)
        {
            _visitsRepository = visitsRepository;
            _illnessesHistoryRepository = illnessesHistoryRepository; 
            _reservationsRepository = reservationsRepository;

        }

        public async Task<bool> CanUserAccessVisit(decimal visitId, BaseController baseController)
        {
            if (baseController.IsPatient())
            {
                return await IsOwnedByPatientVisit(visitId, baseController);
            }
            if (baseController.IsDoctor())
            {
                return await CanDoctorAccessVisit(visitId, baseController);
            }
            if (baseController.IsAdmin())
            {
                return true;
            }

            return false;
        }

        public async Task<bool> CanUserAccessIllnessHistory(decimal illnessHistoryId, BaseController baseController)
        {
            if (baseController.IsPatient())
            {
                return await IsOwnedByPatientIllnessHistory(illnessHistoryId, baseController);
            }
            if (baseController.IsDoctor())
            {
                return await CanDoctorAccessIllnessHistory(illnessHistoryId, baseController);
            }
            if (baseController.IsAdmin())
            {
                return true;
            }

            return false;
        }

        public async Task<bool> CanUserAccessPatientData(decimal patientId, BaseController baseController)
        {
            if (baseController.IsPatient())
            {
                return baseController.UserIdMatches(patientId);
            }
            if (baseController.IsDoctor())
            {
                return await CanDoctorAccessPatientsData(patientId, baseController);
            }
            if (baseController.IsAdmin())
            {
                return true;
            }

            return false;
        }



        private async Task<bool> IsOwnedByPatientVisit(decimal visitId, BaseController baseController)
        {
            var visit = _visitsRepository.GetByID(visitId);
            if (baseController.UserIsPatientAndDoesntHaveAccess(visit.Reservation.PatientId))
            {
                return false;
            }

            return true;
        }

        private async Task<bool> IsOwnedByPatientIllnessHistory(decimal illnessHistoryId, BaseController baseController)
        {
            var illnessHistory = _illnessesHistoryRepository.GetByID(illnessHistoryId);
            var visit = _visitsRepository.GetByID(illnessHistory.VisitId);

            if (baseController.UserIsPatientAndDoesntHaveAccess(visit.Reservation.PatientId))
            {
                return false;
            }

            return true;
        }



        private async Task<bool> CanDoctorAccessPatientsData(decimal patientId, BaseController baseController)
        {
                var doctorId = baseController.GetUserIdFromToken();
                return await _reservationsRepository.PatientAndDoctorHaveCommonReservation(patientId, doctorId);
        }

        private async Task<bool> CanDoctorAccessVisit(decimal visitId, BaseController baseController)
        {
            var reservation = await _reservationsRepository.GetByID(visitId);
            return await CanDoctorAccessPatientsData(reservation.PatientId, baseController);
        }

        private async Task<bool> CanDoctorAccessIllnessHistory(decimal illnessHistoryId, BaseController baseController)
        {
            var illnessHist = _illnessesHistoryRepository.GetByID(illnessHistoryId);
            return await CanDoctorAccessVisit(illnessHist.VisitId, baseController);
        }
    }
}
