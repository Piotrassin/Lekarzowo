import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';

const url = 'https://localhost:5001/api/';

class VisitService {


  getDoctorVisit(localId, startDate, endDate){
    var doctorId = JSON.parse(AuthService.getLoggedUser()).id;
    return fetch(url + 'Reservations/ReservationsByDoctorId?doctorId=' + doctorId
    + '&localId=' + localId + '&start=' + startDate.toISOString() + '&end=' + endDate.toISOString(), {
      headers: authHeader()
    }).then(response => response.json());
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

  checkIfAnyOpenVisit(){
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
    }).then(response => response.json());
  }

  saveMedicineOnVisit(medicineId){

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
    }).then(response => response.json());
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
    }).then(response => response.json());
  }

  getSicknessOnVisitSearch(search, limit, skip){
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
    }).then(response => response.json());
  }

  getSicknessOnVisit(visitId, limit, skip){
    return fetch(url + 'Illnesseshistory/AllByVisitId?visitId=' + visitId +
    '&limit='+ limit + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => response.json());
  }

  getSicknessOnVisitSearch(search, limit, skip, visitId){
    return fetch(url + 'Illnesses/AllByNameOnAVisit?visitId=' + visitId +
    '&name=' + search + '&limit='+ limit + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => response.json());
  }

  getTreatmentOnVisit(visitId, limit, skip){
    return fetch(url + 'Treatmentonvisits/PerformedTreatments?visitId=' + visitId +
    '&limit='+ limit + '&skip=' + skip, {
      headers: authHeader()
    }).then(response => response.json());
  }

  deleteSicknessOnVisit(sicknessHistoryId){
    return fetch(url + 'Illnesseshistory/' + sicknessHistoryId, {
    method: 'DELETE',
    headers: authHeader()
    })
    .then(response => {
      if(!response.ok){
        throw new Error("Nie udało sie");
      }
      return response;
    })
  }

  deleteTreatmentOnVisit(treatmentOnVisitId){
    return fetch(url + 'Treatmentonvisits/' + treatmentOnVisitId, {
    method: 'DELETE',
    headers: authHeader()
    })
    .then(response => {
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
      "PatientId": sickness.patientId,
      "VisitId": sickness.visitId,
      "Description": sickness.description
    })
  }).
  then(response => {
    if(!response.ok){
      throw new Error('Nie udalo sie dodac');
    }
    return response.json();
  })
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
    })
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
    }).
    then(response => {
      if(!response.ok){
        throw new Error('Nie udalo sie dodac');
      }
      return response.json();
    })
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
    })
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
      if(!response.ok) {
        throw Error(response.message)
      }
      return response.json;
    });
  }

  openVisit(reservation){

  }

}

export default new VisitService();
