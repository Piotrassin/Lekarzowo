import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';

const url = 'https://localhost:5001/api/';

class AdminService {

  postMedicine(medicine) {
    return fetch(url + 'Medicines', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "Name": medicine
    })})
    .then(response => {
      if(!response.ok) {
        throw Error(response.message)
      }
      return response.json;
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
      if(!response.ok) {
        throw Error(response.message)
      }
      return response.json;
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
      return response.text();
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
      if(!response.ok) {
        throw Error(response.message)
      }
      return response.json;
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
      if(!response.ok) {
        throw Error(response.message)
      }
      return response.json;
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
      if(!response.ok) {
        throw Error(response.message)
      }
      return response.json;
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
      if(!response.ok) {
        throw Error(response.message)
      }
      return response.json;
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
      console.log(response);
      var resp =  response.json();

      return resp;
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
      console.log(response);
      var resp =  response.json();

      return resp;
    });
  }






}

export default new AdminService();
