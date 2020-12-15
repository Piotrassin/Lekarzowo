import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';

const url = 'https://localhost:5001/api/';

class ReservationService {

  getPossibleAppointments(cityId, specId, doctorId, startDate, endDate, limit, skip){
    var possibleStartDate = startDate.toISOString().split('Z')[0];
    var possibleEndDate = endDate.toISOString().split('Z')[0];
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
    })
    .then(response => {
      if (!response.ok) {
        throw Error({
          statusCode: response.statusCode,
          statusText: response.statusText
        });
      }
      return response;
    })
    .then(response => response.json());
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
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "DoctorId": reservation.doctorId,
      "PatientId": patientId,
      "Starttime": reservation.start,
      "Endtime": reservation.end,
      "Canceled": 0,
      "LocalId": reservation.localId
    })
    })
  }

  cancelReservation(reservationId){
    return fetch(url + 'Reservations/' + reservationId, {
      method: 'PUT',
      headers: authHeader({'Content-Type': 'application/json'}),
      body: JSON.stringify({
        "Id": reservationId,
        "Canceled": 1
      })
    }).then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    });
  }


}
export default new ReservationService();
