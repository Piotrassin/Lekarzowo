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
    return fetch(url + 'Medicinehistories/TakenMedicines?patientId=' + patientId
    + '&limit=' + limit + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => {
      MasterService.handleResponseStatus(response);
      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
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
      return response;
    });
  }

  medicineNoLongerTaken(medicineObject){
    return fetch(url + 'medicinehistories?IllnessHistoryId=' + medicineObject.illnesshistoryId +
    '&MedicineId=' + medicineObject.medicineId + '&StartDate=' + medicineObject.startdate, {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Finishdate": new Date(),
      "IllnessHistoryId": medicineObject.illnesshistoryId ,
      "MedicineId": medicineObject.medicineId,
      "StartDate": medicineObject.startdate
    })
  }).then(response => {
    MasterService.handleResponseStatus(response);
    return response.json()
  }).then(response => {
    if(response.status && response.status == 400){
      throw Error(Validation.handleValidationFetchOutcome(response.errors));
    }
    return response;
  });
  }

}

export default new UserService();
