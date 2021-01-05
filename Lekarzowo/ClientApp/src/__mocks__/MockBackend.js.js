class MockBackend{
  async mockFetch(url, config) {
  var splittedUrl = url.split('https://localhost:5001/api')[1].split('?')[0];
  var urlProps = url.split('?')[1];
  console.log(splittedUrl);
  console.log(config);
  //console.log(config);
   switch (splittedUrl) {
     case '/workinghours/DoctorsUpcomingSchedule': {
       //const user = await users.login(JSON.parse(config.body))
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([]),
       }
     }
     case '/Reservations/UpcomingByDoctorId': {
       //const isAuthorized = user.authorize(config.headers.Authorization)
       return {
         ok: true,
         status: 200,
         json: () => Promise.resolve([{
           reservationStartTime: "2020-10-20T08:30",
           reservationEndTime: "2020-10-20T09:00",
           patientName: "Bartosz",
           patientLastname: "Bartoszewski"
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
