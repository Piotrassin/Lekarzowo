import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';
import MasterService  from  './MasterService.js';
import Validation from '../helpers/Validation.js';

const url = MasterService.url();

class DoctorService {

  getDoctors(search, limit, skip) {
    if(skip == undefined){
      skip = '';
    }
    return fetch(url + 'Doctors/AllByName?Name=' + search + '&limit=' + limit
    + '&skip=' + skip, {
      header: authHeader()
    }).then(response => {
      MasterService.handleResponseStatus(response);
      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      if(response.statusCode && response.statusCode == 400){
        throw Error('Złe parametry. Skontaktuj się z administratorem.')
      }
      return response;
    });
  }

  getDoctorWorkingHours(doctorId, days) {
    return fetch(url + 'workinghours/DoctorsUpcomingSchedule?doctorId='+ doctorId +
    '&days=' + days, {
      headers: authHeader()
    })
    .then(response => {
      MasterService.handleResponseStatus(response);
      return response.json()
    }).then(response => {
      console.log('esonse: ' + response);
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      if(response.statusCode && response.statusCode == 400){
        throw Error('Złe parametry. Skontaktuj się z administratorem.')
      }
      return response;
    });
  }

  getDoctorLocals(search, limit, skip) {
    if(skip == undefined){
      skip = '';
    }
    return fetch(url + 'Doctors/AllByName?Name=' + search + '&limit=' + limit
    + '&skip=' + skip, {
      header: authHeader()
    }).then(response => {
      MasterService.handleResponseStatus(response);
      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      if(response.statusCode && response.statusCode == 400){
        throw Error('Złe parametry. Skontaktuj się z administratorem.')
      }
      return response;
    });
  }

  getSpecializations(search, limit, skip) {
    if(skip == undefined){
      skip = '';
    }
    return fetch(url + 'Specialities/AllByName?Name=' + search + '&limit=' + limit, {
      header: authHeader()
    }).then(response => {
      MasterService.handleResponseStatus(response);
      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      if(response.statusCode && response.statusCode == 400){
        throw Error('Złe parametry. Skontaktuj się z administratorem.')
      }
      return response;
    });
  }

  getDoctor(id){
    return fetch(url + 'Doctors/ContactData/' + id)
    .then(response => {
      MasterService.handleResponseStatus(response);
      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
      }
      if(response.statusCode && response.statusCode == 400){
        throw Error('Złe parametry. Skontaktuj się z administratorem.')
      }
      return response;
    });
  }

}

export default new DoctorService();
