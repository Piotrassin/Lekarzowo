import MasterService  from  '../services/MasterService.js';
import VisitService  from  '../services/VisitService.js';
import Validation from '../helpers/Validation.js';
import authHeader from '../authentication/AuthHeader.js';

const url = MasterService.url();
class AuthService {



  login(email, password) {
    return fetch(url + 'People/Login', {
      method: 'POST',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
      body: JSON.stringify({
        'email': email,
        "Password": {
          "Value": password
        }
      })
    })
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
      if(response.token){
        response.currentRole = response.roles[0];
        console.log('LOGIN CURRENT ROLE');
        console.log(response.currentRole);
        if(response.currentRole == 'doctor'){
          this.checkIfAnyOpenVisit(response.id, response.token);
        }
        localStorage.setItem("userData", JSON.stringify(response));
      }
      return response;
    });
  }

  logout(){
    localStorage.removeItem("userData");
    localStorage.removeItem('activeVisit');
  }

  register(name, lastname, email, birthdate, password, gender, pesel){
    return fetch(url + 'Patients/PostPersonAsPatient',  {
      method: 'POST',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        lastname: lastname,
        email: email,
        birthdate: birthdate,
        Password: {
          Value: password
        },
        gender: gender,
        pesel: pesel
      })
    })
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

  refreshToken(){
    if(this.checkifAnyUserData() == true){
      var userData = JSON.parse(localStorage.getItem("userData"));
      return fetch(url + 'People/RefreshToken', {
        method: 'POST',
        headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + userData.token
              },
        body: JSON.stringify({
          "accessToken": userData.token,
          "refreshToken": userData.refreshToken
        })
      }).then(response => {
        if(!response.ok){
          throw false;
          console.log('response not ok');
        }
        console.log(response);
        return response.json();
      });
    }
    return Promise.resolve(false);
  }

  async updateTokens(token, refreshToken){
    var userData = this.getUser();
    userData.token = token;
    userData.refreshToken = refreshToken;
    await localStorage.setItem("userData", JSON.stringify(userData));
  }

  checkifAnyUserData(){
    try {
        var a = localStorage.getItem("userData");
        if(a == null){
          return false;
        }
        return true;
    } catch(e) {
        return false;
    }
  }
  getUser(){
    if(this.checkifAnyUserData() == true){
      return JSON.parse(localStorage.getItem("userData"));
    }
    return {status: 401};
  }

  getUserId(){
    if(this.checkifAnyUserData() == true){
      return JSON.parse(localStorage.getItem("userData")).id;
    }
    return '';
  }

  getUserName(){
    if(this.checkifAnyUserData() == true){
      return JSON.parse(localStorage.getItem("userData")).firstName.concat(" ").concat(JSON.parse(localStorage.getItem("userData")).lastName);
    }
    return '';
  }

  changeRole(roleName){
    if(this.getUser().roles.length <= 1 || !this.getUser().roles.find(el => el == roleName)){
      return {"state": 1, "message": 'Nie masz przypisanych więcej ról!'}
    }
    console.log("Weszlo change role");

    return fetch(url + 'people/changeactiverole?roleToActivateName=' + roleName, {
      method: 'POST',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.getUser().token
            }
    }).then(response => {
      if(!response.ok){
        throw Error(response.statusText);
      }
      console.log(response);
      return response.json();
      })
    .then(response => {
      console.log(response);
      var userData  = this.getUser();
      userData.token = response.token;
      console.log('');
      userData.currentRole = userData.roles.find(el => el == roleName);
      if(userData.currentRole == 'doctor'){
        this.checkIfAnyOpenVisit(userData.id, response.token);
      }
      localStorage.setItem("userData", JSON.stringify(userData));
      return {"state": 0, "message": 'Zmieniono rolę'};
    })
    .catch(error => {
      return {"state": 1, "message": 'Nie udało się zmienić roli'};
    });

  }

  getLoggedUser(){
    return localStorage.getItem("userData");
  }

  checkIfAnyOpenVisit(doctorId, token){
    //var doctorId = JSON.parse(this.getLoggedUser()).id;
    return fetch(url + 'Visits/OnGoing/' + doctorId, {
     headers: {Authorization: 'Bearer ' + token}
   }).then(response => {
     if(response.status == 404){
       return false;
     }
     if(response.status == 200){
       return response.json();
     }
     return false;
   })
   .then(response => {
     if(response != false){
       VisitService.startVisit(response.reservationId)
     }
   })


  }


  getUserCurrentRole() {
    if(localStorage.getItem("userData") == null){
      return {};
    }
    return JSON.parse(localStorage.getItem("userData")).currentRole;
  }

  getUserRoles(){
    if(this.checkifAnyUserData() == true){
      return JSON.parse(localStorage.getItem("userData")).roles;
    }
    return [];
  }





}
export default new AuthService();
