import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';
import MasterService  from  './MasterService.js';

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
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getDoctorWorkingHours(doctorId, days) {
    return fetch(url + 'workinghours/DoctorsUpcomingSchedule?doctorId='+ doctorId +
    '&days=' + days, {
      headers: authHeader()
    })
    .then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
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
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getSpecializations(search, limit, skip) {
    if(skip == undefined){
      skip = '';
    }
    return fetch(url + 'Specialities/AllByName?Name=' + search + '&limit=' + limit
    + '&skip=' + skip, {
      header: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getDoctor(id){
    return fetch(url + 'Doctors/ContactData/' + id)
    .then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

}

export default new DoctorService();
