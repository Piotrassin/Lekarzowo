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
  console.log(response.headers.get('Token_has_expired'));
  if(response != undefined  && response.status == 401 && response.headers.has('Token_has_expired')){
    console.log("Weszlo");
    AuthService.logout();
    //history.push('/login');
    window.location.reload();
    return true;
  }else {
    console.log("Zwracam false");
    return false;
  }
}

handleResponseStatus(response, customDefaultMessage){
  console.log("HandleRESPPONSESTATUSjet");
  if(!response.ok){
      console.log("Response not ok");
      var errorMessage = this.statusErrorHandler(response, customDefaultMessage);
      if(errorMessage){
        throw Error(errorMessage);
      }
  }
}

statusErrorHandler(response, customDefaultMessage){
  switch(response.status) {
    case 400:
      return false;
      break;
    case 401:
      if (!this.handle401Logout(response)){
        return "Nie masz dostepu."
      }
      return 'Wylogowywanie...';
      break;
    case 403:
      return 'Dostęp zablokowany';
      break;
    case 404:
      return 'Nie znaleziono';
      break;
    case 404:
      return 'Nie znaleziono';
      break;
    case 405:
      return 'Metoda Http nie dozwolona. Skontaktuj się z administratorem.';
      break;
    case 409:
      return 'Nastąpił konflikt. Spróbuj ponownie lub zmień parametry.';
      break;
    case 500:
      return 'Wystąpił problem z serwerem. Odczekaj chwilę i spróbuj ponownie';
      break;
    default:
      if(customDefaultMessage){
        return customDefaultMessage;
      }
      return 'Wystąpił problem. Spróbuj ponownie. Jeżeli problem się utrzymuje, skontaktuj się z administratorem';
      break;
}
}


}
export default new MasterService();
