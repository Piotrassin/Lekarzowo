class MockBackend{
  async mockFetch(url, config) {
  var splittedUrl = url.split('https://localhost:5001/api')[1].split('?')[0];
  var urlProps = url.split('?')[1];
  console.log(splittedUrl);
  console.log(config);
  //console.log(config);
   switch (splittedUrl) {

     case '/Reservations/RecentByDoctorId': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           reservationStartTime: "2020-01-01T08:30",
           reservationEndTime: "2020-01-01T09:00",
           patientName: "Andrzej",
           patientLastname: "Andrzejewski",
           isCanceled: false,
           localName: "Klinika 'Twoje zdrowie'",
           roomNumber: 130

         }]),
       }
     }
     case '/Reservations/UpcomingByDoctorId': {
       //const isAuthorized = user.authorize(config.headers.Authorization)
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           reservationStartTime: "2020-01-20T08:30",
           reservationEndTime: "2020-01-20T09:00",
           patientName: "Bartosz",
           patientLastname: "Bartoszewski",
           isCanceled: false,
           localName: "Klinika 'Twoje zdrowie'",
           roomNumber: 100

         }]),
       }

     }
     case '/Visits/OnGoing/141': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
           value: false
         }),
       }
     }
     case '/Reservations/WithPatientData/5' : {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
           patientName: "Anna",
           patientLastname: "Annowska"
         }),
       }
     }
     case '/Visits/CanBeOpened/5': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
          value: true
         }),
       }
     }
     case '/Visits/5': {
       return {
         ok: false,
         status: 404
       }
     }
     case '/Visits/6': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
          price: 20000,
          description: 'Notatka'
         }),
       }
     }
     case '/Illnesseshistory/PatientHistory': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
            illnessName: 'Ból głowy'
          ,
          description: "Zdiagnozowano z tyłu głowy",
          visitId: 1,
          diagnoseDate: '2021-01-11T18:15:00',
          cureDate: null
         }]),
       }
     }
     case '/Medicinehistories/patientHistory': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
          medicine: {
            name: 'Apap'
          },
          description: 'Opis leku',
          startdate: '2020-12-06T19:58:13',
          finishdate: '2020-12-08T19:58:13'
         }]),
       }
     }
     case '/Medicinehistories/TakenMedicines': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
          medicineName: 'Apap',
          medicineDosage: 'Rano i wieczorem',
          startdate: '2020-10-20T19:20:20'
         }]),
       }
     }
     case '/Illnesseshistory/AllByVisitId': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
          illnessName: 'Ból głowy',
          description: 'Zdiagnozowano'
         }]),
       }
     }
     case '/Treatmentonvisits/PerformedTreatments' : {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
          name: 'Rentgen',
          description: 'Przeprowadzono'
         }]),
       }
     }
     case '/Medicinehistories/PrescribedMedicines' : {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
          name: 'Apap',
          description: 'Rano oraz wieczorem'
         }]),
       }
     }
     case '/illnesseshistory/updatecuredate': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
           value: true
         }),
       }
     }
     case '/medicinehistories/UpdateFinishDate': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
           value: true
         }),
       }
     }
     case '/People/Login': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
           token: "casdcas",
           roles: ['patient'],
           id: 1
         }),
       }
     }
     case '/Doctors/AllByName': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           name: "Anna",
           lastname: 'Annowska',
           specializationName: 'Internista',
           id: 1
         }]),
       }
     }
     case '/cities/AllByName': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           id: 1,
           name: 'Warszawa'
         }, {
           id: 2,
           name: 'Poznań'
         }]),
       }
     }
     case '/Doctors/ContactData/1': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
           email: "a@a.a",
           lastname: "Annowska",
           name: "Anna"
         }),
       }
     }
     case '/workinghours/DoctorsUpcomingSchedule': {
       console.log('Henlo');
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           blocknumber: "1",
           city: {
             id: 2,
             name: "Warszawa"
           },
           name: "Przychodnia",
           postcode: "00-000",
           streetname: "Warszawska",
           streetnumber: 1,
           workinghours: [
             {
                from: "2021-01-28T14:00:00",
                to: "2021-01-28T22:00:00"
             }
           ]
         }]),
       }
     }
     case '/Specialities/AllByName': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           id: 1,
           name: 'Kardiologia'
         }, {
           id: 2,
           name: 'Okulista'
         }]),
       }
     }
     case '/Illnesses/AllByName': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           id: 1,
           name: 'Ból głowy'
         }, {
           id: 2,
           name: 'Gorączka'
         }]),
       }
     }
     case '/Doctors/AllByName': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           id: 1,
           name: 'Andrzej Andrzejewski'
         }, {
           id: 2,
           name: 'Tomasz Tomaszewski'
         }]),
       }
     }
     case '/locals/AllByName': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           id: 1,
           name: 'Szpital kliniczny'
         }, {
           id: 2,
           name: 'Przychodnia'
         }]),
       }
     }
     case '/Medicines/AllByName': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           id: 1,
           name: 'Ibuprom'
         }, {
           id: 2,
           name: 'Apap'
         }]),
       }
     }
     case '/people/allbyname': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           id: 1,
           name: 'Andrzej Andrzejewski'
         }, {
           id: 2,
           name: 'Bartosz Bartoszewski'
         }]),
       }
     }
     case '/Roles/allbyname': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           id: 1,
           name: 'Admin'
         }, {
           id: 2,
           name: 'Doktor'
         }]),
       }
     }
     case '/Treatments/AllByName':{
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           id: 1,
           name: 'Rentgen',
           price: 100
         }, {
           id: 2,
           name: 'Badanie',
           price: 1001
         }]),
       }
     }
     case '/Workinghours/allbyname': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([
           {id: 7, name: "Szpital kliniczny 06.02.2021, 07:30 - 18:00"}, {
           id: 8,
           name: 'Przychodnia 06.02.2021, 07:30 - 18:00'
         }]),
       }
     }
     case '/Rooms/1': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({}),
       }
     }
     case '/Treatments/1': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({}),
       }
     }
     case '/Specialities/1': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({id: 1, name: "Kardiologia", price: 25000, durationOfVisit: 45}),
       }
     }
     case '/Rooms/AllByRoomNumber': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           id: 1,
           number: 100
         }, {
           id: 2,
           number: 102
         }]),
       }
     }
     case '/locals/1':{
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
           name: "Szpital kliniczny",
           city: "Warszawa"
         }),
       }
     }
     case '/Medicines/1': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({

         }),
       }
     }
     case '/Illnesses/1': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({

         }),
       }
     }
     case '/Workinghours/7': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
           doctorId: 1,
           from: "2021-02-06T07:30:00",
           id: 7,
           localId: 4,
           to: "2021-02-06T18:00:00"
         }),
       }
     }
     case '/Doctors/1': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
           id: 1,
           speciality: {id: 2, name: "Ortopedia", price: 20000, durationOfVisit: 0}
         }),
       }
     }
     case '/Patients/PostPersonAsPatient': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
           statusCode: 200
         })
       }
     }
     case '/people/single': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
           email: "a@a.a",
           name: "Anna",
           lastname: "Annowska",
           birthdate: "2020-10-20T19:09:20",
           gender: "K",
           pesel: "20102075674"
         })
       }
     }
     case '/People': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
           value: true
         })
       }
     }
     case '/People/ChangePassword': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({
           value: true
         })
       }
     }
     case '/reservations/possibleappointments': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([]),
       }
     }
     case '/Illnesseshistory/AllByPatientId': {
       //const user = await users.login(JSON.parse(config.body))
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([]),
       }
     }
     case '/workinghours/DoctorsWorkplacesByName': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           id: 1,
           name: 'Szpital kliniczny'
         }, {
           id: 2,
           name: 'Przychodnia'
         }]),
       }
     }
     case '/Userroles/1/1': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({}),
       }
     }
     case '/Userroles': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({}),
       }
     }
     case '/Cities': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({}),
       }
     }
     case '/Locals': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({}),
       }
     }
     case '/Medicines': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({}),
       }
     }
     case '/Rooms': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({}),
       }
     }
     case '/Illnesses': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({}),
       }
     }
     case '/Specialities': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({}),
       }
     }
     case '/Treatments': {
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve({}),
       }
     }
     default: {
       throw new Error(`Unhandled request: ${splittedUrl}`)
     }
   }
 }

 async mockFetchWithError(url, config) {
 var splittedUrl = url.split('https://localhost:5001/api')[1].split('?')[0];
 var urlProps = url.split('?')[1];
 console.log(splittedUrl);
 //console.log(config);
  switch (splittedUrl) {
    default: {
      return {
        ok: false,
        status: 500

      }
    }
  }
 }


}
export default new MockBackend();
