import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';
import Formater from '../helpers/Formater.js';
import MasterService  from  './MasterService.js';
import Validation from '../helpers/Validation.js';

const url = MasterService.url();

class UserService {


  getCities(search, limit){
    if (search === undefined)
    {
      search  = ''
    }
    return fetch(url + 'cities/AllByName?Name=' + search + '&limit=' + limit, {
      headers: authHeader()
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

  getSpecializations(search, limit){

    if (search === undefined)
    {
      search  = ''
    }
    return fetch(url + 'Specialities/AllByName?Name=' + search + '&limit=' + limit, {
      headers: authHeader()
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

  getDoctors(search, limit) {

    if (search === undefined)
    {
      search  = ''
    }
    return fetch(url + 'Doctors/AllByName?Name=' + search + '&limit=' + limit, {
      headers: authHeader()
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

  getUserData(){
    return fetch(url + 'people/single', {
      headers: authHeader()
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

  getUserSicknessHistory(id) {
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Illnesseshistory/AllByPatientId?patientId=' + patientId, {
      headers: authHeader()
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

  getUserMedicineHistory(limit, skip) {
    if(limit == undefined){
      limit = '';
    }
    if(skip == undefined){
      skip = '';
    }
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Medicinehistories/patientHistory?patientId=' + patientId
    + '&limit=' + limit + '&skip=' + skip, {
      headers: authHeader()
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

  postUserChangeDetails(user){
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'People', {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Id": patientId,
      "Name": user.name,
      "Lastname": user.lastname,
      "Pesel": user.pesel,
      "Email": user.email,
      "Birthdate": user.birthdate,
      "Gender": user.gender
    })
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

  changePassword(passwordObject){
    var email = JSON.parse(AuthService.getLoggedUser()).email;
    return fetch(url + 'People/ChangePassword', {
      method: 'POST',
      headers: authHeader({'Content-Type': 'application/json'}),
      body: JSON.stringify({
        "Email": email,
        "CurrentPassword": {
          "Value": passwordObject.currentPassword
        },
        "NewPassword": {
          "Value": passwordObject.newPassword
        },
        "ConfirmPassword": {
          "Value": passwordObject.confirmPassword
        }
      })
    }).then(response => {
      MasterService.handleResponseStatus(response, "Nie udało się zmienić hasła. Spróbuj później");
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

  medicineNoLongerTaken(medicineObject){
    return fetch(url + 'medicinehistories/UpdateFinishDate?illnessHistoryId=' + medicineObject.illnesshistoryId +
    '&medicineId=' + medicineObject.medicineId + '&startDate=' + medicineObject.startdate
    + '&finishDate=' + new Date().toISOString() , {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'})
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

  sicknessEnded(id){
    return fetch(url + 'illnesseshistory/updatecuredate?illnesshistoryid=' + id + '&curedate=' + new Date().toISOString(), {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'})
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

}

export default new UserService();
