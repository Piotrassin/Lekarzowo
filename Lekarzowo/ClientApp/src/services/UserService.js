import authHeader from '../authentication/AuthHeader.js'

const url = 'https://localhost:5001/api/';

class UserService {
  getDashboardContent(){
    return fetch(url + 'visits' , {
      headers: authHeader()
    });
  }

}

export default new UserService();
