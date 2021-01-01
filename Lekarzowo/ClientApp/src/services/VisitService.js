import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';
import MasterService  from  './MasterService.js';

const url = MasterService.url();

class VisitService {


  getDoctorVisit(localId, startDate, endDate){
    var doctorId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Reservations/ReservationsByDoctorId?doctorId=' + doctorId
    + '&localId=' + localId + '&start=' + startDate.toISOString() + '&end=' + endDate.toISOString(), {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  startVisit(id) {
    var visitObject = {
      "id": id,
      "startDate": new Date()
    };
    localStorage.setItem("activeVisit", JSON.stringify(visitObject));
    return true;
  }

  endVisit() {
    localStorage.removeItem('activeVisit');
    return true;
  }

  setVisitOngoing(id, state){

    return fetch(url + 'Visits/ChangeStatus?visitId=' + id +
    '&isOnGoing=' + state, {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'})
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  checkIfAnyOpenVisit(){
    var doctorId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Visits/OnGoing/' + doctorId, {
     headers: authHeader()
   }).then(response => {
     if(response.status == 404){
       return false;
     }
     if(response.status == 200){
       return true;
     }
     return false;
   });


  }

  checkIfAnyOpenVisitLocal(){

    var activeVisit = localStorage.getItem('activeVisit');
    if(activeVisit == null){
      return false;
    }
    return true;

  }

  getOpenedVisit(){
    var activeVisit = localStorage.getItem('activeVisit');
    if(activeVisit == null){
      return false;
    }
    return JSON.parse(activeVisit);
  }

  canVisitBeOpened(id){

    return fetch(url + 'Visits/CanBeOpened/' + id, {
     headers: authHeader()
   }).then(response => {
     if(response.status == 401 && (!MasterService.handle401Logout(response))){
         throw new Error(401);
     }
     if(response.status >= 400){
       throw Error("err");
     }
     return response.json();
   })
   .then(response => {
     return response.value;
   })

  }

  getAvailableMedicine(search, limit, skip){
    if (search === undefined)
    {
      search  = ''
    }
    if (skip === undefined)
    {
      skip  = 0
    }
    return fetch(url + 'Medicines/AllByName?Name=' +search + '&limit=' + limit
    + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }



  getAvailableTreatments(search, limit, skip){
    if (search === undefined)
    {
      search  = ''
    }
    if (skip === undefined)
    {
      skip  = 0
    }
    return fetch(url + 'Treatments/AllByName?Name=' +search + '&limit=' + limit
    + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getAvailableSicknesses(search, limit, skip){
    if (search === undefined)
    {
      search  = ''
    }
    if (skip === undefined)
    {
      skip  = 0
    }
    return fetch(url + 'Illnesses/AllByName?Name=' +search + '&limit=' + limit
    + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getSicknessOnVisitSearch(search, limit, skip, visitId){
    if (search === undefined)
    {
      search  = ''
    }
    if (skip === undefined)
    {
      skip  = 0
    }
    return fetch(url + 'Illnesseshistory/AllByNameOnAVisit?Name=' +search + '&limit=' + limit
    + '&skip=' + skip + '&visitId=' + visitId, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getSicknessOnVisit(visitId, limit, skip){
    return fetch(url + 'Illnesseshistory/AllByVisitId?visitId=' + visitId +
    '&limit='+ limit + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }


  getTreatmentOnVisit(visitId, limit, skip){
    return fetch(url + 'Treatmentonvisits/PerformedTreatments?visitId=' + visitId +
    '&limit='+ limit + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  getMedicineOnVisit(visitId, limit, skip){
    return fetch(url + 'Medicinehistories/PrescribedMedicines?visitId=' + visitId +
    '&limit='+ limit + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  deleteSicknessOnVisit(sicknessHistoryId){
    return fetch(url + 'Illnesseshistory/' + sicknessHistoryId, {
    method: 'DELETE',
    headers: authHeader()
    })
    .then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      if(!response.ok){
        throw new Error("Nie udało sie");
      }
      return response;
    });


  }

  deleteTreatmentOnVisit(treatmentOnVisitId){
    return fetch(url + 'Treatmentonvisits/' + treatmentOnVisitId, {
    method: 'DELETE',
    headers: authHeader()
    })
    .then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      if(!response.ok){
        throw new Error("Nie udało sie");
      }
      return response;
    })
  }

  deleteMedicineOnVisit(illnessHistoryId, medicineId, startDate){

    return fetch(url + 'Medicinehistories/?illnessHistoryId=' + illnessHistoryId +
    '&medicineId=' + medicineId + '&startDate=' + startDate, {
    method: 'DELETE',
    headers: authHeader()
    })
    .then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      if(!response.ok){
        throw new Error("Nie udało sie");
      }
      return response;
    })
  }

  postSicknessOnVisit(sickness){

    return fetch(url + 'Illnesseshistory', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "IllnessId": sickness.id,
      "VisitId": sickness.visitId,
      "Description": sickness.description
    })
  }).then(response => {
    if(response.status == 401 && (!MasterService.handle401Logout(response))){
        throw new Error(401);
    }
    return response.json()
  });


  }

  postMedicineOnVisit(medicine){
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Medicinehistories', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "MedicineId": medicine.id,
      "IllnesshistoryId": medicine.illnessId,
      "Startdate": medicine.startDate,
      "Finishdate": medicine.endDate,
      "Description": medicine.description
    })
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }


  postTreatmentOnVisit(treatment){

    return fetch(url + 'Treatmentonvisits', {
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "TreatmentId": treatment.id,
      "VisitId": treatment.visitId,
      "Description": treatment.description,
      "PatientId": treatment.patientId
    })
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  putDescriptionOnVisit(visitId, description){
    var patientId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Visits/' + visitId, {
    method: 'PUT',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "ReservationId": visitId,
      "Description": description
    })
    }).then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  postVisit(reservationId){
    return fetch(url + 'Visits',{
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "ReservationId": reservationId,
      "Price": 0,
      "Description": ''
    })
    })
    .then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }



  postOldMedicinehistory(oldMedicineHistoryObject){
    return fetch(url + 'Oldmedicinehistories',{
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "MedicineId": oldMedicineHistoryObject.medicineId,
      "PatientId": oldMedicineHistoryObject.patientId,
      "Date": oldMedicineHistoryObject.finishDate,
      "Description": oldMedicineHistoryObject.description
    })
    })
    .then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });
  }

  postOldillnesshistory(oldIllnessHistoryObject){
    return fetch(url + 'Oldillnesshistories',{
    method: 'POST',
    headers: authHeader({'Content-Type': 'application/json'}),
    body: JSON.stringify({
      "IllnessId": oldIllnessHistoryObject.illnessId,
      "PatientId": oldIllnessHistoryObject.patientId,
      "Date": oldIllnessHistoryObject.diagnoseDate,
      "Description": oldIllnessHistoryObject.description,
      "Curedate": oldIllnessHistoryObject.cureDate
    })
    })
    .then(response => {
      if(response.status == 401 && (!MasterService.handle401Logout(response))){
          throw new Error(401);
      }
      return response.json()
    });

  }

}

export default new VisitService();
