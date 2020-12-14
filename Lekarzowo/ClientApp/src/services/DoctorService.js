import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';

const url = 'https://localhost:5001/api/';

class DoctorService {
  getDoctors(search, limit, skip) {
    return fetch(url + 'Doctors/AllByName?Name=' + search + '&limit=' + limit
    + '&skip=' + skip, {
      header: authHeader()
    }).then(response => response.json());
  }


}

export default new DoctorService();
