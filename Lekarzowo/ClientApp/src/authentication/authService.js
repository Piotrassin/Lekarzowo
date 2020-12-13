const url = 'https://localhost:5001/api/';


class AuthService {



  login(email, password) {
    return fetch(url + 'People/Login', {
      method: 'POST',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
      body: JSON.stringify({
        'email': email,
        "Password": {
          "Value": password
        }
      })
    }).then(response => response.json())
    .then(response => {
      if(response.token){
        response.currentRole = response.roles[0];
        localStorage.setItem("userData", JSON.stringify(response));
        console.log(response.token);
      }
      return response;
    });
  }

  logout(){
    localStorage.removeItem("userData");
    localStorage.removeItem('activeVisit');
  }

  register(name, lastname, email, birthdate, password, gender, pesel){
    return fetch(url + 'People',  {
      method: 'POST',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        lastname: lastname,
        email: email,
        birthdate: birthdate,
        Password: {
          Value: password
        },
        gender: gender,
        pesel: pesel
      })
    });
  }
  getUser(){
    return JSON.parse(localStorage.getItem("userData"));
  }

  changeRole(roleName){
    if(this.getUser().roles.length <= 1 || !this.getUser().roles.find(el => el == roleName)){
      return {"state": 1, "message": 'Nie masz przypisanych więcej ról!'}
    }
    console.log("Weszlo change role");

    return fetch(url + 'people/changeactiverole?roleToActivateName=' + roleName, {
      method: 'POST',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.getUser().token
            }
    }).then(response => {
      if(!response.ok){
        throw Error(response.statusText);
      }
      console.log(response);
      return response.json();
      })
    .then(response => {
      console.log(response);
      var userData  = this.getUser();
      userData.token = response.token;
      userData.currentRole = userData.roles.find(el => el == roleName);
      localStorage.setItem("userData", JSON.stringify(userData));
      return {"state": 0, "message": 'Zmieniono rolę'};
    })
    .catch(error => {
      return {"state": 1, "message": 'Nie udało się zmienić roli'};
    });

  }

  getLoggedUser(){
    return localStorage.getItem("userData");
  }



  getUserCurrentRole() {
    if(localStorage.getItem("userData") == null){
      return {};
    }
    return JSON.parse(localStorage.getItem("userData")).currentRole;
  }

  getUserRoles(){
    return JSON.parse(localStorage.getItem("userData")).roles;
  }





}
export default new AuthService();
