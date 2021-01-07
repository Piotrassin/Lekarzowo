import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import UserService from './services/UserService.js';
import AuthService from './authentication/AuthService.js';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';


class ProfileUserEdit extends React.Component {
constructor(props){
  super(props);

  this.state = {
      email: "",
      name: "",
      lastname: "",
      birthdate: "1997-10-20",
      gender: "X",
      pesel: "",
      oldPassword: "",
      password: "",
      passwordValid: "",
      touched: {
        user: false,
        password: false
      },
      snackbarRef: null
  }
  this.handleChange = this.handleChange.bind(this);
  this.handleClickUserChange = this.handleClickUserChange.bind(this);
  this.handleClickPasswordChange = this.handleClickPasswordChange.bind(this);
  this.handleGenferChange = this.handleGenferChange.bind(this);
}

componentDidMount(){
  this.setState({
    snackbarRef: React.createRef()
  }, () => {
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
    })
    .catch(err => {
        try{
          this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
        }catch(erorr){
          console.log('Missed Reference');
        };
    });
  });
}

handleChange(event) {
  this.setState({
      [event.target.name]: event.target.value
  });
  if(event.target.name == "password"){
    this.setState(prevState => ({
      touched: {
        ...prevState.touched,
        password: true
      }
    }));
  }else {
    this.setState(prevState => ({
      touched: {
        ...prevState.touched,
        user: true
      }
    }));
  }
}

handleGenferChange(event){
  this.setState({
    gender: event.target.value
  });
  this.setState(prevState => ({
    touched: {
      ...prevState.touched,
      user: true
    }
  }));
}

handleClickUserChange(event){
  if(this.state.touched.user){
    this.setState ({
      errors: Validation.validateUserChange(this.state.name, this.state.lastname, this.state.birthdate,
        this.state.gender, this.state.pesel, this.state.email)
    }, () => {
      if(Object.keys(this.state.errors).length > 0){
        var message = Validation.handleValidationOutcome(this.state.errors);
        this.state.snackbarRef.current.openSnackBar( message ,'red-snackbar');
      }else {
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
          this.state.snackbarRef.current.openSnackBar('Zaktualizowano Dane', 'green-snackbar');
        })
        .catch(err => {
            try{
              this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
            }catch(erorr){
              console.log('Missed Reference');
            };
        });
      }
    })
  }
  else {
    try{
      this.state.snackbarRef.current.openSnackBar( 'Dane nie zostały zmienione.' ,'red-snackbar');
    }catch(erorr){
      console.log('Missed Reference');
  }
}
}

handleClickPasswordChange(event){
  if(this.state.touched.password){
    if(this.state.password == this.state.passwordValid){
      this.setState ({
        errors: Validation.validatePasswordChange(this.state.password, this.state.passwordValid)
      }, () => {
        if(Object.keys(this.state.errors).length > 0){
          var message = Validation.handleValidationOutcome(this.state.errors);
          this.state.snackbarRef.current.openSnackBar( message ,'red-snackbar')
        }else {
      var passwordObject = {
        currentPassword: this.state.oldPassword,
        newPassword: this.state.password,
        confirmPassword: this.state.passwordValid
      }
      UserService.changePassword(passwordObject)
      .then(response => {
        this.setState({
          oldPassword: "",
          password: "",
          passwordValid: "",
          touched: {
            password: false
          }
        })
        this.state.snackbarRef.current.openSnackBar('Zaktualizowano Hasło', 'green-snackbar');
      })
      .catch(err => {
          try{
            this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
          }catch(erorr){
            console.log('Missed Reference');
          };
      });
      }})
    }
    else {
      try{
        this.state.snackbarRef.current.openSnackBar('Pola Nowe Hasło oraz Powtórz Hasło są różne.', 'red-snackbar');
      }catch(erorr){
        console.log('Missed Reference');
      };
    }
  }
  else {
  try{
    this.state.snackbarRef.current.openSnackBar('Pola do zmiany hasła nie zostały wypełnione.', 'red-snackbar');
  }catch(erorr){
    console.log('Missed Reference');
  };
  }


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
            <InputLabel style={{fontSize: '12.5px'}} >Płeć</InputLabel>
            <Select

            value={this.state.gender}
            onChange={this.handleGenferChange}
            fullWidth
            label="Płeć"
            size="small"
            >
              <MenuItem value={"M"}>Mężczyzna</MenuItem>
              <MenuItem value={"K"}>Kobieta</MenuItem>
              <MenuItem value={"X"}>Wolę nie podawać</MenuItem>
            </Select>
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
            <a className = 'button-red' onClick = {this.handleClickPasswordChange}>Zmień</a>
            </div>
          </div>
        </form>
      </div>
      <br/><br/>
      <div className = 'rodo'>
        <a>Wypełnienie formularza oznacza wyrażenie zgody na przetwarzanie przez Lekarzowo Systems podanych w formularzu danych osobowych w celu udzielenia odpowiedzi na zadane pytanie i w zależności od treści zapytania przedstawienia oferty. Tutaj dowiesz się kim jesteśmy i jak przetwarzamy Twoje dane.
        Zobacz więcej: https://lekarzowo.pl/o-nas </a>
      </div>
      <Snackbar ref = {this.state.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default ProfileUserEdit;
