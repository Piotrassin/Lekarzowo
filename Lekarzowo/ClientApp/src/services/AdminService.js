import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';
import MasterService  from  './MasterService.js';

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
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
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
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
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
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
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
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
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
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });

  }

  postTreatment(treatment){
    return fetch(url + 'Treatments', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Name": treatment
    })})
    .then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
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
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });

  }

  postDoctor(doctor){
    return fetch(url + 'doctors/PostPersonAsDoctor', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify(doctor)})
    .then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });

  }

  postWorkinghours(workinghours){
    return fetch(url + 'Workinghours', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify(workinghours)})
    .then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
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
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
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
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }






}

export default new AdminService();
