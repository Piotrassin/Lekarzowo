import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';
import Formater from '../helpers/Formater.js';
import MasterService  from  './MasterService.js';
import Validation from '../helpers/Validation.js';

const url = MasterService.url();

class ReservationService {

  getPossibleAppointments(reservationRequestObject, limit, skip){
    //var possibleStartDate = startDate.toISOString().split('Z')[0];
    //var possibleEndDate = endDate.toISOString().split('Z')[0];
    if(!skip){
      skip = "";
    }
    if(reservationRequestObject.doctorId == undefined){
      reservationRequestObject.doctorId = "";
    }

    return fetch(url + 'reservations/possibleappointments?CityId=' + reservationRequestObject.cityId
    + '&SpecId=' + reservationRequestObject.specialityId + '&DoctorId=' + reservationRequestObject.doctorId
    + '&startDate=' + reservationRequestObject.startDate + '&endDate=' + reservationRequestObject.endDate
    + '&startHour=' + reservationRequestObject.startHour + '&endHour=' + reservationRequestObject.endHour
    + '&limit=' + limit + '&skip=' + skip, {
      headers: authHeader()
    })
    .then(response => {
      MasterService.handleResponseStatus(response);

      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      return response;
    });

  }

  getUpcomingDoctorReservations(dateStart, dateEnd, limit, skip){
    if(limit == undefined){
      limit = '';
    }
    if(skip == undefined){
      skip = '';
    }
    if(JSON.parse(AuthService.getLoggedUser())){
      var doctorId = JSON.parse(AuthService.getLoggedUser()).id;
    }
    if(limit == undefined){
      limit = "";
    }
    return fetch(url + 'Reservations/UpcomingByDoctorId?doctorId=' + doctorId +
    '&localId=1' + '&start=' + Formater.formatDate(dateStart.toISOString()) + '&end='
    + Formater.formatDate(dateEnd.toISOString()) +  '&limit=' + limit +
    '&skip=' + skip, {
      headers: authHeader()
    }).then(response => {
      MasterService.handleResponseStatus(response);

      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      return response;
    });
  }

  getUpcomingReservations(limit, skip){
    if(limit == undefined){
      limit = '';
    }
    if(skip == undefined){
      skip = '';
    }
    if(JSON.parse(AuthService.getLoggedUser())){
      var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    }
    return fetch(url + 'Reservations/Upcoming?PatientId=' + patientId +
    '&Limit=' + limit + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => {
      MasterService.handleResponseStatus(response);

      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      return response;
    });
  }

  getRecentDoctorReservations(dateStart, dateEnd, limit, skip){
    if(limit == undefined){
      limit = '';
    }
    if(skip == undefined){
      skip = '';
    }
    if(JSON.parse(AuthService.getLoggedUser())){
      var doctorId = JSON.parse(AuthService.getLoggedUser()).id;
    }
    return fetch(url + 'Reservations/RecentByDoctorId?doctorId=' + doctorId +
    '&start=' + Formater.formatDate(dateStart.toISOString()) + '&end='
    + Formater.formatDate(dateEnd.toISOString()) + '&limit=' + limit +
    '&skip=' + skip, {
      headers: authHeader()
    }).then(response => {
      MasterService.handleResponseStatus(response);

      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      return response;
    });
  }

  getRecentReservations(limit, skip){
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Reservations/Recent?PatientId=' + patientId +
    '&Limit=' + limit + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => {
      MasterService.handleResponseStatus(response);

      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      return response;
    });
  }


  getTakenMedicine(limit) {
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Medicinehistories/TakenMedicines?patientId=' + patientId
    + '&limit=' + limit, {
      headers: authHeader()
    }).then(response => {
      MasterService.handleResponseStatus(response);

      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      return response;
    });
  }

  getTakenMedicinePatient(patientId, limit) {

    return fetch(url + 'Medicinehistories/TakenMedicines?patientId=' + patientId
    + '&limit=' + limit, {
      headers: authHeader()
    }).then(response => {
      MasterService.handleResponseStatus(response);

      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      return response;
    });
  }

  getReservation(reservationId){
    return fetch(url + 'Reservations/WithPatientData/' + reservationId, {
      headers: authHeader()
    })
    .then(response => {
      MasterService.handleResponseStatus(response);

      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      return response;
    });
  }

  getVisitDetails(visitId){
    return fetch(url + 'Visits/' + visitId, {
      headers: authHeader()
    })
    .then(response => {
      //MasterService.handleResponseStatus(response);
      if(response.status == 404){
        throw Error(404);
      }
      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      return response;
    });
  }

  getPastIllnesses(limit){
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Illnesseshistory/PatientHistory?patientId=' + patientId
    + '&limit=' + limit, {
      headers: authHeader()
    }).then(response => {
      MasterService.handleResponseStatus(response);

      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      return response;
    });
  }

  getPastIllnessesPatient(patientId, limit){

    return fetch(url + 'Illnesseshistory/PatientHistory?patientId=' + patientId
    + '&limit=' + limit, {
      headers: authHeader()
    }).then(response => {
      MasterService.handleResponseStatus(response);

      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      return response;
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
      MasterService.handleResponseStatus(response);

      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      return response;
    });
  }

  cancelReservation(reservationId){
    return fetch(url + 'Reservations/Cancel/' + reservationId, {
      headers: authHeader()
    })
    .then(response => {
      MasterService.handleResponseStatus(response, "Nie udało się anulować  rezerwacji. Spróbuj później");
      if(response.status == 204){
          return response.text()
      }
      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      return response;
    });
  }


}
export default new ReservationService();
