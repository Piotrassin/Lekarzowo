import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import UserService from './services/UserService.js';
import AuthService from './authentication/AuthService.js';
import Snackbar from './helpers/Snackbar.js';

class ProfileUserEdit extends React.Component {
constructor(props){
  super(props);
  this.handleChange = this.handleChange.bind(this);
  this.handleClickUserChange = this.handleClickUserChange.bind(this);
  this.state = {
      email: "",
      name: "",
      lastname: "",
      birthdate: "1997-10-20",
      gender: "",
      pesel: "",
      oldPassword: "",
      password: "",
      passwordValid: "",
      touched: {
        user: false,
        password: false
      }
  }
}
snackbarRef = React.createRef();

handleChange(event) {
  this.setState({
      [event.target.name]: event.target.value
  });
  if(event.target.name == "password"){
    this.setState({
      touched: {
        password: true
      }
    });
  }else {
    this.setState({
      touched: {
        user: true
      }
    });
  }
}

handleClickUserChange(event){
  if(this.state.touched.user){
    var userObject = {
      email: this.state.email,
      name: this.state.name,
      lastname: this.state.lastname,
      birthdate: this.state.birthdate,
      gender: this.state.gender,
      pesel: this.state.pesel
    }
    UserService.postUserChangeDetails(userObject)
    .then(response => {
      console.log(response);
      this.snackbarRef.current.openSnackBar('Zaktualizowano', 'green-snackbar');
    })
    .catch(err => console.log(err));
  }
}

componentDidMount(){
  console.log(JSON.parse(AuthService.getLoggedUser()).id);
  UserService.getUserData()
  .then(response => {
      this.setState({
          email: response.email,
          name: response.name,
          lastname: response.lastname,
          birthdate: response.birthdate.split('T')[0],
          gender: response.gender,
          pesel: response.pesel
      });
  });

}


render() {
  return(
    <div className = 'profile-content-holder flex-column'>
      <a className = 'subheader-content-profile'>Dane Osobowe</a>
      <a className = 'subheading-content-profile'>Edycja Danych Pacjenta</a>
      <div className = 'flex-row'>
        <form className = 'edit-user-form flex-row'>
          <div className = 'flex-column form-left-column'>

            <TextField id="name" name="name"
            label="Imię"
            value = {this.state.name}
            onChange = {this.handleChange}
            size="small" fullWidth />
            <br/>
            <TextField id="birthdate" name="birthdate"
            label="Data Urodzenia"
            type="date"
            value = {this.state.birthdate}
            onChange = {this.handleChange}
            size="small" fullWidth />
            <br/>
            <TextField id="gender" name="gender"
            label="Płeć"
            value = {this.state.gender}
            onChange = {this.handleChange}
            size="small" fullWidth />
          </div>
          <div className = 'flex-column form-right-column'>
            <TextField id="lastname" name="lastname"
            label="Nazwisko"
            value = {this.state.lastname}
            onChange = {this.handleChange}
            size="small" fullWidth />
            <br/>
            <TextField id="email" name="email"
            label="Email"
            value = {this.state.email}
            onChange = {this.handleChange}
            size="small" fullWidth />
            <br/>
            <TextField id="pesel" name="pesel"
            label="Pesel"
            value = {this.state.pesel}
            onChange = {this.handleChange}
            size="small" fullWidth />
            <br/><br/>
            <div>
            <a className = 'button-green' onClick = {this.handleClickUserChange}>Edytuj</a>
            </div>
          </div>
        </form>
      </div>
      <a className = 'subheading-content-profile'>Zmiana Hasła</a>
      <div className = 'flex-row'>
        <form className = 'edit-user-form flex-row'>
          <div className = 'flex-column form-left-column'>
            <TextField id="oldPassword" name="oldPassword"
            label="Stare hasło"
            value = {this.state.oldPassword}
            onChange = {this.handleChange}
            type = 'password'
            size="small" fullWidth />

            <TextField id="passwordValid" name="passwordValid"
            label="Powtórz Hasło"
            value = {this.state.passwordValid}
            onChange = {this.handleChange}
            type = 'password'
            size="small" fullWidth />


          </div>
          <div className = 'flex-column form-right-column'>
            <TextField id="password" name="password"
            label="Nowe Hasło"
            value = {this.state.password}
            onChange = {this.handleChange}
            type = 'password'
            size="small" fullWidth />
            <br/><br/>
            <div>
            <a className = 'button-red'>Zmień</a>
            </div>
          </div>
        </form>
      </div>
      <br/><br/>
      <div className = 'rodo'>
      <a>Wypełnienie formularza oznacza wyrażenie zgody na przetwarzanie przez Lekarzowo Systems podanych w formularzu danych osobowych w celu udzielenia odpowiedzi na zadane pytanie i w zależności od treści zapytania przedstawienia oferty. Tutaj dowiesz się kim jesteśmy i jak przetwarzamy Twoje dane.
Zobacz więcej: https://lekarzowo.pl/o-nas </a>
      </div>
      <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default ProfileUserEdit;
