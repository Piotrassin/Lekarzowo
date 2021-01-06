import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';
import MasterService  from  './MasterService.js';
import Validation from '../helpers/Validation.js';

const url = MasterService.url();

class AdminService {

  postMedicine(medicine) {
    return fetch(url + 'Medicines', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Name": medicine
    })})
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
  putMedicine(id, medicineName){
    return fetch(url + 'Medicines/' + id, {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Id": id,
      "Name": medicineName
    })})
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

  putSickness(id, sicknessName){
    return fetch(url + 'Illnesses/' + id, {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Id": id,
      "Name": sicknessName
    })})
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

  getAllSickness(){
    return fetch(url + 'Illnesses', {
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

  getAllMedicines(){
    return fetch(url + 'Medicines', {
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

  getAllLocals() {
    return fetch(url + 'Locals', {
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

  deleteSickness(id){
    return fetch(url + 'Illnesses/' + id, {
    method: 'DELETE',
    headers: authHeader({'Content-Type': 'application/json'})
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

  deleteUserRoles(roleId, userId){
    return fetch(url + 'Userroles/' + userId + '/' + roleId, {
    method: 'DELETE',
    headers: authHeader({'Content-Type': 'application/json'})
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


  deleteMedicine(id){
    return fetch(url + 'Medicines/' + id, {
    method: 'DELETE',
    headers: authHeader({'Content-Type': 'application/json'})
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

  postIllness(illness){
    return fetch(url + 'Illnesses', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Name": illness
    })})
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

  postCity(city){
    return fetch(url + 'Cities', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Name": city
    })})
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

  putCity(cityId, cityName){
    return fetch(url + 'Cities/' + cityId, {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Id": cityId,
      "Name": cityName
    })})
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

  deleteCity(cityId){
    return fetch(url + 'Cities/' + cityId, {
    method: 'DELETE',
    headers: authHeader({'Content-Type': 'application/json'})
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

  postLocal(local){
    return fetch(url + 'Locals', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Name": local.name,
      "CityId": local.cityId,
      "Streetname": local.streetName,
      "Postcode": local.postCode,
      "Streetnumber": local.streetNumber,
      "Blocknumber": local.blockNumber
    })})
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

  putLocal(localId, local){
    return fetch(url + 'Locals/' + localId, {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Id": localId,
      "Name": local.name,
      "CityId": local.cityId,
      "Streetname": local.streetName,
      "Postcode": local.postCode,
      "Streetnumber": local.streetNumber,
      "Blocknumber": local.blockNumber
    })})
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

  postRoom(room){
    return fetch(url + 'Rooms', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Number": room.number,
      "LocalId": room.localId
    })})
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

  getAllRooms(){
    return fetch(url + 'Rooms', {
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

  getAllTreatments() {
    return fetch(url + 'Treatments', {
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

  getAllSpecializations(){
    return fetch(url + 'Specialities', {
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

  getAllWorkingHours(doctorId, localId){
    return fetch(url + 'Workinghours/allbyname?date=&limit='
    + '&doctorId=' + doctorId + '&localId=' + localId, {
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

  putRoom(roomId, roomNumber, localId){
    return fetch(url + 'Rooms/' + roomId, {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Id": roomId,
      "Number": roomNumber,
      "LocalId": localId
    })})
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

  deleteRoom(roomId){
    return fetch(url + 'Rooms/' + roomId , {
      method: 'DELETE',
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

  postUserAddRole(roleId, userId){
    return fetch(url + 'Userroles', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "PersonId": userId,
      "RoleId": roleId
    })})
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

  postTreatment(treatment, price){
    return fetch(url + 'Treatments', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Name": treatment,
      "Price": price
    })})
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

  putTreatment(treatmentId, treatment, price){
    return fetch(url + 'Treatments/' + treatmentId, {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Id": treatmentId,
      "Name": treatment,
      "Price": price
    })})
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

  postSpeciality(speciality){
    return fetch(url + 'Specialities', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Name": speciality.name,
      "Price": speciality.price
    })})
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

  deleteTreatment(id) {
    return fetch(url + 'Treatments/' + id, {
      method: 'DELETE',
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

  putSpeciality(specialityId, specialityName, specialityPrice){
    return fetch(url + 'Specialities/' + specialityId, {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Id": specialityId,
      "Name": specialityName,
      "Price": specialityPrice
    })})
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

  deleteSpeciality(id){
    return fetch(url + 'Specialities/' + id, {
      method: 'DELETE',
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

  postDoctor(doctor){
    return fetch(url + 'doctors/PostPersonAsDoctor', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify(doctor)})
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

  putDoctor(doctorId, specialityId){
    return fetch(url + 'Doctors/' + doctorId, {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Id":  doctorId,
      "SpecialityId": specialityId
    })})
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

  getDoctor(id){
    return fetch(url + 'Doctors/' + id, {
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

  getSpeciality(id){
    return fetch(url + 'Specialities/' + id, {
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

  getLocal(id){
    return fetch(url + 'locals/' + id, {
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

  deleteLocal(id){
    return fetch(url + 'locals/' + id, {
      method: 'DELETE',
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



  deleteDoctor(id){
    return fetch(url + 'Doctors/' + id, {
      method: 'DELETE',
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

  postWorkinghours(workinghours){
    return fetch(url + 'Workinghours', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify(workinghours)})
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

  putWorkinghours(workinghoursID, workinghours){
    return fetch(url + 'Workinghours/' + workinghoursID, {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Id": workinghoursID,
      "From": workinghours.From,
      "To": workinghours.To,
      "DoctorId": workinghours.DoctorId,
      "LocalId": workinghours.LocalId
    })})
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

  deleteWorkinghours(workinghoursID){
    return fetch(url + 'Workinghours/' + workinghoursID, {
      method: 'DELETE',
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

  getLocals(search, limit){
    if (search === undefined)
    {
      search  = ''
    }
    return fetch(url + 'locals/AllByName?Name=' + search + '&limit=' + limit, {
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

  getAllCities(){
    return fetch(url + 'Cities', {
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

  getAllDoctors() {
    return fetch(url + 'Doctors/All', {
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

  getAlllUserRoles(){
    return fetch(url + 'People/WithRoles', {
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

  getWorkinghours(search, limit, skip, idObject){
    if (search === undefined)
    {
      search  = '';
    }
    if(skip === undefined){
      skip = '';
    }
    return fetch(url + 'Workinghours/allbyname?date=' + search + '&limit=' + limit
    + '&doctorId=' + idObject.doctorId + '&localId' + idObject.localId, {
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

  getWorkinghoursById(id){
    return fetch(url + 'Workinghours/' + id, {
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

  getUsers(search, limit ){
    if (search === undefined)
    {
      search  = ''
    }
    return fetch(url + 'people/allbyname?Name=' + search + '&limit=' + limit, {
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

  getRoles(search, limit){
    if (search === undefined)
    {
      search  = ''
    }
    return fetch(url + 'Roles/allbyname?Name=' + search + '&limit=' + limit, {
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

  getUserRoles(userId){
    return fetch(url + 'Userroles/' + userId, {
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



  getLocalsByDoctorId(search, limit, skip, doctorId){
    if (search === undefined)
    {
      search  = ''
    }
    return fetch(url + 'workinghours/DoctorsWorkplacesByName?localName=' + search + '&limit=' + limit +
    '&doctorId=' + doctorId, {
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

  getRoomsByLocalId(search, limit, skip, localId){
    if (search === undefined)
    {
      search  = ''
    }
    return fetch(url + 'Rooms/AllByRoomNumber?roomNumber=' + search + '&limit=' + limit +
    '&localId=' + localId, {
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
      response = response.map((object) => {
        return {
          id: object.id,
          name: "" + object.number
        }
      })
      return response;
    });
  }






}

export default new AdminService();
