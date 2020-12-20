import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';

const url = 'https://localhost:5001/api/';

class ReservationService {

  getPossibleAppointments(reservationRequestObject, limit, skip){
    //var possibleStartDate = startDate.toISOString().split('Z')[0];
    //var possibleEndDate = endDate.toISOString().split('Z')[0];
    if(!skip){
      skip = "";
    }

    return fetch(url + 'reservations/possibleappointments?CityId=' + reservationRequestObject.cityId
    + '&SpecId=' + reservationRequestObject.specialityId + '&DoctorId=' + reservationRequestObject.doctorId
    + '&startDate=' + reservationRequestObject.startDate + '&endDate=' + reservationRequestObject.endDate
    + '&startHour=' + reservationRequestObject.startHour + '&endHour=' + reservationRequestObject.endHour
    + '&limit=' + limit + '&skip=' + skip, {
      headers: authHeader()
    })
    .then(response => response.json());

  }

  getUpcomingReservations(limit, skip){
    if(JSON.parse(AuthService.getLoggedUser())){
      var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    }
    return fetch(url + 'Reservations/Upcoming?PatientId=' + patientId +
    '&Limit=' + limit + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401){
        console.log('throwing 401 error');
        throw new Error(401);
      };
      if(!response.ok){
        console.log('throwin other error');
        throw new Error(response.statusText)
      }
      console.log('Continue');
      return response.json()
    });
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

  getReservation(reservationId){
    return fetch(url + 'Reservations/' + reservationId, {
      headers: authHeader()
    }).then(response => {
      console.log(response);
      if (!response.ok) {
        console.log('w srodk');
        throw Error(response.status);
      }
      console.log('Poza');
      return response;
    })
    .then(response => response.json());
  }

  getVisitDetails(visitId){
    return fetch(url + 'Visits/' + visitId, {
      headers: authHeader()
    })
    .then(response => {
      console.log(response);
      if (!response.ok) {
        console.log('w srodk');
        throw Error(response.status);
      }
      console.log('Poza');
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
    }).then(response => {
      if(response.status > 400){
        console.log(response);
        throw new Error('Błąd przy rezerwacji');
      }
      return response.json();
    })
  }

  cancelReservation(reservationId){
    return fetch(url + 'Reservations/Cancel/' + reservationId, {
      headers: authHeader()
    }).then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    });
  }


}
export default new ReservationService();
