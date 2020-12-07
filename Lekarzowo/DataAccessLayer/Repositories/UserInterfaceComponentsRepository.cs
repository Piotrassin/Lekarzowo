using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.Services;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class UserInterfaceComponentsRepository : IUserInterfaceComponentsRepository
    {
        private readonly ModelContext _context;
        public UserInterfaceComponentsRepository(ModelContext context)
        {
            _context = context;
        }

        #region stareWidoki
        public async Task<IEnumerable<object>> AddressData(decimal RoomId)
        {
            return await _context.Room.Where(r => r.Id == RoomId)
                .Select(r => new
                {
                    roomId = r.Id,
                    roomNumber = r.Number,
                    localId = r.Local.Id,
                    localName = r.Local.Name,
                    localStreetname = r.Local.Streetname,
                    localStreetnumber = r.Local.Streetnumber,
                    localBlocknumber = r.Local.Blocknumber,
                    cityName = r.Local.City.Name,
                    localPostcode = r.Local.Postcode
                }).ToListAsync();
        }

        public async Task<IEnumerable<object>> DoctorsAndSpecializations(decimal DoctorId)
        {
            return await _context.Doctor.Where(doctor => doctor.Id == DoctorId)
                .Select(doc => new
                {
                    doctorId = doc.Id,
                    specialityName = doc.Speciality.Name,
                    specialityPricePerHour = doc.Speciality.Price
                }).ToListAsync();
        }

        public async Task<IEnumerable<object>> DoctorSchedule(decimal DoctorId, decimal LocalId)
        {
            return await _context.Reservation.Where(d => d.DoctorId == DoctorId && d.Room.LocalId == LocalId)
                .Select(s => new
                {
                    reservationId = s.Id,
                    reservationStartTime = s.Starttime,
                    reservationEndTime = s.Endtime,
                    reservationIsCanceled = s.Canceled,
                    patientId = s.Patient.Id,
                    patientName = s.Patient.IdNavigation.Name,
                    patientLastname = s.Patient.IdNavigation.Lastname,
                    roomNumber = s.Room.Number,
                    localName = s.Room.Local.Name,
                    localStreetName = s.Room.Local.Streetname,
                    localStreetNumber = s.Room.Local.Streetnumber,
                    localBlockNumber = s.Room.Local.Blocknumber,
                    cityName = s.Room.Local.City.Name
                }).ToListAsync();
        }

        public async Task<IEnumerable<object>> DoctorsList(decimal? SpecializationId, decimal? CityId)
        {           
            return await _context.Doctor
                .Where(d => d.SpecialityId == SpecializationId || !SpecializationId.HasValue)
                .Select(d => new
                {
                    doctorId = d.Id,
                    doctorName = d.IdNavigation.Name,
                    doctorLastame = d.IdNavigation.Lastname,
                    specialityName = d.Speciality.Name,
                    specialityPricePerHour = d.Speciality.Price,

                    WorkingHours = _context.Workinghours
                    .Where(w => w.Local.CityId == CityId || !CityId.HasValue)
                    .Where(y => y.DoctorId == d.IdNavigation.Id)
                    .Select(w => new
                    {
                        workHoursId = w.Id,
                        workHoursFrom = w.From,
                        workHoursTo = w.To,
                        localName = w.Local.Name,
                        localStreetName = w.Local.Streetname,
                        localStreetNumber = w.Local.Streetnumber,
                        localBlockNumber = w.Local.Blocknumber,
                        cityName = w.Local.City.Name
                    })
                }).ToListAsync();
        }

        public async Task<IEnumerable<object>> IllnessAndMedicinesDetails(decimal PatientId, decimal IllnessId)
        {
            //return await _context.Patient.Where(p => p.Id == patientId)
            //    .Select(x => new
            //    {
            //        patientId = x.Id,
            //        patientName = x.IdNavigation.Name,
            //        patientLastname = x.IdNavigation.Lastname,

            //        ilnesses = _context.Illnesshistory
            //        .Where(w => w.patientId == patientId)
            //        .Where(z => z.IllnessId == IllnessId)
            //        .Select(w => new
            //        {
            //            reservationId = w.Visit.ReservationId,
            //            illnessHistoryId = w.Id,
            //            illnessName = w.Illness.Name,
            //            illnessHistoryDiagnoseDate = w.Visit.Reservation.Starttime,
            //            illnessHistoryCureDate = w.Curedate,
            //        }),

            //        oldIllnesses = _context.Oldillnesshistory
            //        .Where(w => w.patientId == patientId)
            //        .Where(z => z.IllnessId == IllnessId)
            //        .Select(w => new
            //        {
            //            illnessId = w.IllnessId,
            //            illnessName = w.Illness.Name,
            //            oldIllnessHistoryDiagnoseDate = w.Date,
            //            oldIllnessHistoryCureDate = w.Curedate
            //        })
            //    }).ToListAsync();

            return await _context.Patient.Where(p => p.Id == PatientId)
                .Select(x => new
                {
                    patientId = x.Id,
                    patientName = x.IdNavigation.Name,
                    patientLastname = x.IdNavigation.Lastname,

                    illnesses = _context.Illnesshistory.Where(q => q.PatientId == PatientId)
                            .Select(illnessHist => new
                            {
                                illnessHistoryId = illnessHist.Id,
                                illnessName = illnessHist.Illness.Name,
                                illnessHistoryDescription = illnessHist.Description,
                                illnessHistoryCureDate = illnessHist.Curedate,

                                Medicines = _context.Medicinehistory.Where(y => y.IllnesshistoryId == illnessHist.Id)
                                .Select(z => new
                                {
                                    medicineName = z.Medicine.Name,
                                    medicineHistoryStartDate = z.Startdate,
                                    medicineHistoryFinishDate = z.Finishdate,
                                    medicineHistoryDescription = z.Description
                                })
                            }),

                    oldIllnesses = _context.Oldillnesshistory.Where(z => z.PatientId == PatientId)
                    .Select( z => new
                    {
                        oldIllnessId = z.IllnessId,
                        oldIllnessName = z.Illness.Name,
                        oldIllnessHistoryDescription = z.Description,
                        oldIllnessHistoryCureDate = z.Curedate,
                    }),

                    oldMedicines = _context.Oldmedicinehistory
                    .Where(w => w.PatientId == PatientId)
                    .Select(w => new
                    {
                        oldMedicineName = w.Medicine.Name,
                        oldMedicineHistoryStartDate = w.Date,
                        oldMedicineHistoryDescription = w.Description
                    })
                }).ToListAsync();
        }

        public async Task<IEnumerable<object>> IllnessAndMedicinesList(decimal PatientId)
        {
            return await _context.Patient.Where(p => p.Id == PatientId)
                .Select(x => new
                {
                    patientId = x.Id,
                    patientName = x.IdNavigation.Name,
                    patientLastname = x.IdNavigation.Lastname,
                    
                    ilnesses = _context.Illnesshistory.Where(w => w.PatientId == PatientId)
                    .Select(w => new
                    {
                        illnessHistoryId = w.Id,
                        reservationId = w.Visit.ReservationId,
                        illnessName = w.Illness.Name,
                        illnessHistoryDiagnoseDate = w.Visit.Reservation.Starttime,
                        illnessHistoryCureDate = w.Curedate,
                    }),

                    oldIllnesses = _context.Oldillnesshistory.Where(w => w.PatientId == PatientId)
                    .Select(w => new
                    {
                        illnessId = w.IllnessId,
                        illnessName = w.Illness.Name,
                        oldIllnessHistoryDiagnoseDate = w.Date,
                        oldIllnessHistoryCureDate = w.Curedate
                    })
                }).ToListAsync();
        }

        public async Task<IEnumerable<object>> PatientIllnesses(decimal PatientId)
        {
            return await _context.Patient.Where(p => p.Id == PatientId)
                .Select(x => new
                {
                    patientId = x.Id,
                    patientName = x.IdNavigation.Name,
                    patientLastname = x.IdNavigation.Lastname,
                    
                    ilnesses = _context.Illnesshistory.Where(w => w.PatientId == PatientId)
                    .Select(w => new
                    {
                        illnessHistoryId = w.Id,
                        illnessName = w.Illness.Name,
                        illnessHistoryDiagnoseDate = w.Visit.Reservation.Starttime,
                        illnessHistoryCureDate = w.Curedate
                    }),

                    oldIllnesses = _context.Oldillnesshistory.Where(w => w.PatientId == PatientId)
                    .Select(w => new
                    {
                        illnessId = w.IllnessId,
                        illnessName = w.Illness.Name,
                        oldIllnessHistoryDiagnoseDate = w.Date,
                        oldIllnessHistoryCureDate = w.Curedate
                    })
                }).ToListAsync();
        }

        public async Task<IEnumerable<object>> VisitDetails(decimal ReservationId)
        {
            return await _context.Visit.Where(visit => visit.ReservationId == ReservationId)
                .Select(visit => new
                {
                    patientId = visit.Reservation.Patient.IdNavigation.Id,
                    patientName = visit.Reservation.Patient.IdNavigation.Name,
                    patientLastname = visit.Reservation.Patient.IdNavigation.Lastname,
                    patientBirthdate = visit.Reservation.Patient.IdNavigation.Birthdate,

                    doctorName = visit.Reservation.Doctor.IdNavigation.Name,
                    doctorLastname = visit.Reservation.Doctor.IdNavigation.Lastname,
                    doctorSpeciality = visit.Reservation.Doctor.Speciality.Name,
                    doctorSpecialityPricePerHour = visit.Reservation.Doctor.Speciality.Price,

                    reservationId = visit.Reservation.Id,
                    reservationStartTime = visit.Reservation.Starttime,

                    visitPrice = visit.Price,
                    visitDescription = visit.Description,

                    Illnesses = _context.Illnesshistory.Where(x => x.VisitId == ReservationId)
                    .Select(illnessHist => new
                    {
                        illnessId = illnessHist.Id,
                        illnessName = illnessHist.Illness.Name,
                        illnessHistoryDescription = illnessHist.Description,
                        illnessHistoryCureDate = illnessHist.Curedate,

                        Medicines = _context.Medicinehistory.Where(y => y.IllnesshistoryId == illnessHist.Id)
                        .Select(z => new
                        {
                            medicineName = z.Medicine.Name,
                            medicineHistoryStartDate = z.Startdate,
                            medicineHistoryFinishDate = z.Finishdate,
                            medicineHistoryDescription = z.Description
                        })
                    }),

                    treatmentOnVisitDescription = _context.Treatmentonvisit.Where(x => x.VisitId == ReservationId)
                    .Select(treatment => new
                    {
                        treatmentName = treatment.Treatment.Name,
                        treatmentPrice = treatment.Treatment.Price,
                        treatmentOnVisitDescription = treatment.Description
                    }),

                    roomNumber = visit.Reservation.Room.Number,
                    localName = visit.Reservation.Room.Local.Name,
                    localStreetname = visit.Reservation.Room.Local.Streetname,
                    localStreetnumber = visit.Reservation.Room.Local.Streetnumber,
                    localBlocknumber = visit.Reservation.Room.Local.Blocknumber,
                    cityName = visit.Reservation.Room.Local.City.Name,
                    localPostcode = visit.Reservation.Room.Local.Postcode
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<object>> VisitList(decimal PatientId)
        {
            return await _context.Visit.Where(visit => visit.Reservation.PatientId == PatientId)
                .Select(visit => new
                {
                    patientId = visit.Reservation.Patient.IdNavigation.Id,
                    doctorName = visit.Reservation.Doctor.IdNavigation.Name,
                    doctorLastname = visit.Reservation.Doctor.IdNavigation.Lastname,
                    doctorSpeciality = visit.Reservation.Doctor.Speciality.Name,
                    reservationId = visit.Reservation.Id,
                    reservationStartTime = visit.Reservation.Starttime,
                    localName = visit.Reservation.Room.Local.Name,
                })
                .ToListAsync();
        }
        #endregion


        //TODO: Przenieść do odpowiednich kontrolerów.
        public async Task<IEnumerable<object>> IllnessesHistory(decimal patientId, int? limit, int? skip)
        {
            var query = _context.Illnesshistory.Where(x => x.PatientId == patientId)
                .Select(x => new
                {
                    IllnessName = x.Illness.Name,
                    DiagnoseDate = x.Visit.Reservation.Starttime,
                    CureDate = x.Curedate
                })
                .OrderBy(x => x.DiagnoseDate);

            var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }

        public async Task<IEnumerable<object>> PerformedTreatments(decimal visitId, int? limit, int? skip)
        {
            var query = _context.Treatmentonvisit.Where(x => x.VisitId == visitId)
                .Select(x => new
                {
                    TreatmentName = x.Treatment.Name,
                    TreatmentDescription = x.Description
                }).OrderBy(x => x.TreatmentName);

            var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }

        public async Task<IEnumerable<object>> PrescribedMedicines(decimal visitId, int? limit, int? skip)
        {
            var query = _context.Medicinehistory.Where(x => x.Illnesshistory.VisitId == visitId)
                .Select(x => new
                {
                    MedicineName = x.Medicine.Name,
                    MedicineDosage = x.Description
                }).OrderBy(x => x.MedicineName).ThenBy(x => x.MedicineDosage);

            var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }

        public async Task<IEnumerable<object>> TakenMedicines(decimal patientId, int? limit, int? skip)
        {
            var query = _context.Medicinehistory.Where(x => x.Illnesshistory.PatientId == patientId)
                .Select(x => new
                {
                    MedicineName = x.Medicine.Name,
                    MedicineDosage = x.Description
                }).OrderBy(x => x.MedicineName).ThenBy(x => x.MedicineDosage);

            var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }

    }
}
