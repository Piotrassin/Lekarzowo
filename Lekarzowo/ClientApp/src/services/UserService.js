import authHeader from '../authentication/AuthHeader.js';
import AuthService from '../authentication/AuthService.js';

const url = 'https://localhost:5001/api/';

class UserService {
  getDashboardContent(){
    return fetch(url + 'visits' , {
      headers: authHeader()
    });
  }

  getCities(){
    return {
      "WAW": {"item": [{"name": "Warszawa"}]},
      "PZN": {"item": [{"name": "Poznań"}]},
      "BDG": {"item": [{"name": "Bydgoszcz"}]},
      "JAB": {"item": [{"name": "Jabłonna"}]},
      "GDA": {"item": [{"name": "Gdańsk"}]},
      "LGW": {"item": [{"name": "Legionowo"}]},
      "ZBK": {"item": [{"name": "Ząbki"}]},
      "GDY": {"item": [{"name": "Gdynia"}]},
      "WRC": {"item": [{"name": "Wrocław"}]}
    };
  }

  getSpecializations(){
    return {
      "1": {"item": [{"name": "Kardiolog"}]},
      "2": {"item": [{"name": "Okulista"}]},
      "3": {"item": [{"name": "Internista"}]},
      "4": {"item": [{"name": "Pediatra"}]},
      "5": {"item": [{"name": "Kolanista"}]},
      "6": {"item": [{"name": "Populista"}]},
      "7": {"item": [{"name": "Pisowiec"}]}
    };
  }

  getDoctors() {
    return {
      "1": {"item": [{"name": "dr. Andrzej Andrzejewski"}]},
      "2": {"item": [{"name": "dr. Anna Nowak"}]},
      "3": {"item": [{"name": "dr. Karol Kowalski"}]},
      "4": {"item": [{"name": "dr. med. Katarzyna Kat"}]},
      "5": {"item": [{"name": "dr. Beata Beatynska"}]},
      "6": {"item": [{"name": "inter. Jarosław Nowak"}]},
      "7": {"item": [{"name": "dr. Justyna Kowal"}]}
    };
  }

  getUserData(){
    return fetch(url + 'people/' + JSON.parse(AuthService.getLoggedUser()).id, {
      headers: authHeader()
    }).then(response => response.json());
  }

  getUserSicknessHistory() {
    return fetch(url + 'uicomponents/PatientIllnesses/3', {
      headers: authHeader()
    }).then(response => response.json());
  }

}

export default new UserService();
