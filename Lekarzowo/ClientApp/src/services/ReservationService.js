import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';

const url = 'https://localhost:5001/api/';

class ReservationService {

  getPossibleAppointments(cityId, specId, doctorId, startDate, endDate, limit, skip){
    var possibleStartDate = startDate.toISOString();
    var possibleEndDate = endDate.toISOString();
    if(!skip){
      skip = "";
    }

    return fetch(url + 'reservations/possibleappointments?CityId=' +
    cityId + "&SpecId=" + specId + "&DoctorId=" + doctorId +
    "&start=" + possibleStartDate + "&end=" + possibleEndDate +
    "&limit=" + limit + "&skip=" + skip)
    .then(response => response.json());

  }

  getUpcomingReservations(limit, skip){
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;

    return fetch(url + 'Reservations/Upcoming?PatientId=' + patientId +
    '&Limit=' + limit + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => response.json());
  }

  getRecentReservations(limit, skip){
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Reservations/Recent?PatientId=' + patientId +
    '&Limit=' + limit + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => response.json());
  }


  getTakenMedicine(limit) {
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Medicinehistories/TakenMedicines?patientId=' + patientId
    + '&limit=' + limit, {
      headers: authHeader()
    }).then(response => response.json());
  }

  getVisitDetails(visitId){
    return fetch(url + 'Visits/' + visitId, {
      headers: authHeader()
    }).then(response => response.json());
  }

  getPastIllnesses(limit){
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Illnesseshistory/PatientHistory?patientId=' + patientId
    + '&limit=' + limit, {
      headers: authHeader()
    }).then(response => response.json());
  }

  postReservation(reservation){
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Reservations', {
    method: 'POST',
    headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
    body: JSON.stringify({
      "DoctorId": reservation.doctorId,
      "PatientId": patientId,
      "Starttime": reservation.startTime,
      "Endtime": reservation.endtime,
      "Canceled": 0,
      "LocalId": reservation.localId
    })
    })
  }


}
export default new ReservationService();
