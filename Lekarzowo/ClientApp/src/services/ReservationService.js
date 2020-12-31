import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';
import Formater from '../helpers/Formater.js';
import MasterService  from  './MasterService.js';

const url = MasterService.url();

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
    .then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });

  }

  getUpcomingDoctorReservations(dateStart, dateEnd,limit){
    if(JSON.parse(AuthService.getLoggedUser())){
      var doctorId = JSON.parse(AuthService.getLoggedUser()).id;
    }
    if(limit == undefined){
      limit = "";
    }
    return fetch(url + 'Reservations/UpcomingByDoctorId?doctorId=' + doctorId +
    '&localId=1' + '&start=' + Formater.formatDate(dateStart.toISOString()) + '&end='
    + Formater.formatDate(dateEnd.toISOString()) +  '&limit=' + limit, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getUpcomingReservations(limit, skip){
    if(JSON.parse(AuthService.getLoggedUser())){
      var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    }
    return fetch(url + 'Reservations/Upcoming?PatientId=' + patientId +
    '&Limit=' + limit + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getRecentDoctorReservations(dateStart, dateEnd){
    if(JSON.parse(AuthService.getLoggedUser())){
      var doctorId = JSON.parse(AuthService.getLoggedUser()).id;
    }
    return fetch(url + 'Reservations/RecentByDoctorId?doctorId=' + doctorId +
    '&start=' + Formater.formatDate(dateStart.toISOString()) + '&end='
    + Formater.formatDate(dateEnd.toISOString()), {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getRecentReservations(limit, skip){
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Reservations/Recent?PatientId=' + patientId +
    '&Limit=' + limit + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }


  getTakenMedicine(limit) {
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Medicinehistories/TakenMedicines?patientId=' + patientId
    + '&limit=' + limit, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getTakenMedicinePatient(patientId, limit) {

    return fetch(url + 'Medicinehistories/TakenMedicines?patientId=' + patientId
    + '&limit=' + limit, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getReservation(reservationId){
    return fetch(url + 'Reservations/WithPatientData/' + reservationId, {
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
    .then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getVisitDetails(visitId){
    return fetch(url + 'Visits/' + visitId, {
      headers: authHeader()
    })
    .then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getPastIllnesses(limit){
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Illnesseshistory/PatientHistory?patientId=' + patientId
    + '&limit=' + limit, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getPastIllnessesPatient(patientId, limit){

    return fetch(url + 'Illnesseshistory/PatientHistory?patientId=' + patientId
    + '&limit=' + limit, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
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
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  cancelReservation(reservationId){
    return fetch(url + 'Reservations/Cancel/' + reservationId, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      if(!response.ok){
          throw new Error("Nie udało się anulować  rezerwacji. Spróbuj później");
      }
      return response.json()
    });
  }


}
export default new ReservationService();
