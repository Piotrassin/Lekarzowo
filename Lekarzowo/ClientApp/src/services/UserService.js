import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';

const url = 'https://localhost:5001/api/';

class UserService {
  getDashboardContent(){
    return fetch(url + 'visits' , {
      headers: authHeader()
    });
  }

  getCities(search, limit){
    if (search === undefined)
    {
      search  = ''
    }
    return fetch(url + 'cities/AllByName?Name=' + search + '&limit=' + limit, {
      headers: authHeader()
    }).then(response => {
      console.log(response);
      var resp =  response.json();
      console.log(resp[0]);
      return resp;
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
      console.log(response);
      var resp =  response.json();
      console.log(resp[0]);
      return resp;
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
      var resp =  response.json();
      return resp;
    });

  }

  getUserData(){
    return fetch(url + 'people/single', {
      headers: authHeader()
    }).then(response => response.json());
  }

  getUserSicknessHistory(id) {
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Illnesseshistory/AllByPatientId/' + patientId, {
      headers: authHeader()
    }).then(response => response.json());
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
    }).then(response => response.json());

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
    if (!response.ok) {
      throw Error(response.statusText);
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

      return response.json();
    });
  }

}

export default new UserService();
