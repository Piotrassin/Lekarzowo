import history from '../History.js';
import AuthService from '../authentication/AuthService.js';

const url = 'https://localhost:5001/api/';

class MasterService {

url(){
  return url;
}

handle401Logout(response){
  console.log('Response');
  console.log(response);
  console.log(response.headers.get('Content-Length'));
  if(response != undefined  && response.status == 401 && response.headers.has('Token_has_expired')){
    console.log("Weszlo");
    AuthService.logout();
    history.push('/login');
    return true;
  }else {
    console.log("Zwracam false");
    return false;
  }
}


}
export default new MasterService();
