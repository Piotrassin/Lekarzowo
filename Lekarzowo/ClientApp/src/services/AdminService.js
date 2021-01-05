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
      return response;
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
      MasterService.handleResponseStatus(response);
      return response.json()
    }).then(response => {
      if(response.status && response.status == 400){
        throw Error(Validation.handleValidationFetchOutcome(response.errors));
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
      return response;
    });
  }






}

export default new AdminService();
