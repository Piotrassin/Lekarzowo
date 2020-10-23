using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class SQLPerspectivesRepository : ISQLPerspectivesRepository
    {
        private readonly ModelContext _context;
        public SQLPerspectivesRepository(ModelContext context)
        {
            _context = context;
        }

        public Task<IEnumerable<View_AddressData>> AddressData(decimal RoomId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<View_DocsAndSpecs>> DoctorsAndSpecializations(decimal DoctorId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<View_DoctorSchedule>> DoctorSchedule(decimal DoctorId, decimal LocalId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<View_DoctorList>> DoctorsList(decimal SpecializationId, decimal CityId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<View_IllnessMedDetails>> IllnessAndMedicinesDetails(decimal PatientId, decimal IllnessId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<View_IllnessMedList>> IllnessAndMedicinesList(decimal PatientId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<View_PatientIllnesses>> PatientIllnesses(decimal PatientId)
        {
            throw new NotImplementedException();
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

        public Task<IEnumerable<View_VisitList>> VisitList(decimal PatientId)
        {
            throw new NotImplementedException();
        }
    }
}
