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
        localStorage.setItem("userData", JSON.stringify(response));
        console.log(response.token);
      }
      return response;
    });
  }

  logout(){
    localStorage.removeItem("userData");
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

  getLoggedUser(){
    return localStorage.getItem("userData");
  }

}
export default new AuthService();
