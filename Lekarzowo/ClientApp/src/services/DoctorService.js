import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';

const url = 'https://localhost:5001/api/';

class DoctorService {

  getDoctors(search, limit, skip) {
    if(skip == undefined){
      skip = '';
    }
    return fetch(url + 'Doctors/AllByName?Name=' + search + '&limit=' + limit
    + '&skip=' + skip, {
      header: authHeader()
    }).then(response => response.json());
  }

  getDoctorWorkingHours(doctorId, days) {
    return fetch(url + 'workinghours/DoctorsUpcomingSchedule?doctorId='+ doctorId +
    '&days=' + days, {
      headers: authHeader()
    })
    .then(response => response.json());
  }

  getDoctorLocals(search, limit, skip) {
    if(skip == undefined){
      skip = '';
    }
    return fetch(url + 'Doctors/AllByName?Name=' + search + '&limit=' + limit
    + '&skip=' + skip, {
      header: authHeader()
    }).then(response => response.json());
  }

  getDoctor(id){
    return fetch(url + 'Doctors/ContactData/' + id)
    .then(response => response.json());
  }

}

export default new DoctorService();
