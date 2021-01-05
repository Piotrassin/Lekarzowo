import React from "react"
import doctor from './images/Doctor.svg';
import AuthService from './authentication/AuthService.js';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';

class Registration extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
      passwordValid: "",
      name: "",
      lastname: "",
      birthdate: "",
      gender: "",
      pesel: "",
      touched: {
        email: false,
        password: false,
        passwordValid: false,
        name: false,
        lastname: false,
        birthdate: false,
        gender: false,
        pesel: false
      },
      errors: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  snackbarRef = React.createRef();

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState ({
      errors: Validation.validateRegistration(this.state.name, this.state.lastname, this.state.birthdate,
        this.state.gender, this.state.pesel, this.state.email, this.state.password,
        this.state.passwordValid)
    }, () => {
      if(Object.keys(this.state.errors).length > 0){
        var message = Validation.handleValidationOutcome(this.state.errors);
        this.snackbarRef.current.openSnackBar( message ,'red-snackbar');
      }else {
        AuthService.register(this.state.name, this.state.lastname, this.state.email,
          this.state.birthdate, this.state.password, this.state.gender,
          this.state.pesel).then(
            response => {
                this.props.history.push('/login');
                window.location.reload();
            }
          )
          .catch(err => {
              try{
                this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
              }catch(erorr){
                console.log('Missed Reference');
              };
          });
      }
    });

  }


  render(){
    return (
      <div className = "loginContainer">
        <div className = "loginInputContainer" style = {{width : '100%'}}>
        <a className="header-1" >Zarejestruj się</a>
        <a className = "header-3">Tylko parę kroków czeka cię od dostępu do tysiąca lekarzy!</a>
        <form onSubmit = {this.handleSubmit} className = "loginForm">
          <div className = "flex-row justify-space-between">
          <div className = "label-input-group flex-column">
          <label htmlFor="name" className = "label">Imię</label>
          <input id = "name"
          className = "input"
          name = "name"
          type = "text"
          value = {this.state.name}
          onChange = {this.handleChange}
          />
          </div>
          <div className = "label-input-group flex-column">
          <label htmlFor="lastname" className = "label">Nazwisko</label>
          <input id = "lastname"
          className = "input"
          type = "text"
          name = "lastname"
          value = {this.state.lastname}
          onChange = {this.handleChange}
          />
          </div>
          </div>
          <div className = "flex-row justify-space-between">
          <div className = "label-input-group flex-column">
          <label htmlFor="birthdate" className = "label">Data Urodzenia</label>
          <input id = "birthdate"
          className = "input"
          type = "date"
          name = "birthdate"
          value = {this.state.birthdate}
          onChange = {this.handleChange}
          />
          </div>
          <div className = "label-input-group flex-column">
          <label htmlFor="gender" className = "label">Płeć</label>
          <input id = "gender"
          className = "input"
          type = "text"
          name = "gender"
          value = {this.state.gender}
          onChange = {this.handleChange}
          />
          </div>
          </div>
          <div className = "flex-row justify-space-between">
          <div className = "label-input-group flex-column">
          <label htmlFor="pesel" className = "label">Pesel</label>
          <input id = "pesel"
          className = "input"
          type = "number"
          name = "pesel"
          value = {this.state.pesel}
          onChange = {this.handleChange}
          />
          </div>
          <div className = "label-input-group flex-column">
          <label htmlFor="email" className = "label">Email</label>
          <input id = "email"
          className = "input"
          type = "text"
          name = "email"
          value = {this.state.email}
          onChange = {this.handleChange}
          />
          </div>
          </div>
          <div className = "flex-row justify-space-between">
          <div className = "label-input-group flex-column">
          <label htmlFor = "password" className = "label">Hasło</label>
          <input
          className = "input"
          type = "password"
          name = "password"
          value = {this.state.password}
          onChange = {this.handleChange}
          />
          </div>
          <div className = "label-input-group flex-column">
          <label htmlFor = "passwordValid" className = "label">Powtórz Hasło</label>
          <input
          className = "input"
          type = "password"
          name = "passwordValid"
          value = {this.state.passwordValid}
          onChange = {this.handleChange}
          />
          </div>
          </div>
          <br/>
          <div style = {{width: "100%"}}>
          <button  className = "register-button">Zarejestruj</button>
          </div>
        </form>
        </div>
        <div className = "loginPictureContainer">
        <img
            className = "centeredImage"
            src={doctor}
            height="300"
             />
        </div>
        <Snackbar ref = {this.snackbarRef} />
      </div>
    );
  }

}
export default Registration;
