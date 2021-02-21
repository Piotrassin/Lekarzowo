import history from '../History.js';
import AuthService from '../authentication/AuthService.js';

const url = 'https://localhost:5001/api/';

class MasterService {

url(){
  return url;
}

async handle401Logout(response){
  console.log('Response');
  console.log(response);
  if(response != undefined  && response.status == 401 && response.headers.has('Token_has_expired')){
    console.log("Weszlo");
    var userData = AuthService.getUser();
    AuthService.refreshToken()
    .then(async response => {
      if(response == false){
        AuthService.logout();
        window.location.reload();

      }
      await AuthService.updateTokens(response.accessToken, response.refreshToken);
      window.location.reload();

    })
    .catch(err => {
      AuthService.logout();
      window.location.reload();
    });
    //AuthService.logout();
    //history.push('/login');
    //window.location.reload();

    return true;
  }else {
    console.log("Zwracam false");
    return false;
  }
}

handleResponseStatus(response, customDefaultMessage){

  if(!response.ok){

      var errorMessage = this.statusErrorHandler(response, customDefaultMessage);
      if(errorMessage){
        throw Error(errorMessage);
      }
  }

}


handleResponseStatusExclude404(response, customDefaultMessage){
  if(!response.ok){
      var errorMessage = this.statusErrorHandler(response, customDefaultMessage, true);
      if(errorMessage){
        throw Error(errorMessage);
      }
  }
}


statusErrorHandler(response, customDefaultMessage, exclude404){
  switch(response.status) {
    case 400:
      return false;
      break;
    case 401:
      if (!this.handle401Logout(response)){
        return "Nie masz dostepu."
      }
      return 'Zaczekaj chwilę...';
      break;
    case 403:
      return 'Dostęp zablokowany';
      break;
    case 404:
      if(exclude404 == true){
        return false;
      }
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
