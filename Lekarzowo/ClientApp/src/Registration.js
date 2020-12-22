import React from "react"
import Doctor from './images/Doctor.svg';
import AuthService from './authentication/AuthService.js';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';

class Registration extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.shouldMarkError = this.shouldMarkError.bind(this);
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
      console.log(this.state.errors);
      if(Object.keys(this.state.errors).length > 0){
        var message = Validation.handleValidationOutcome(this.state.errors);
        this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

      }else {
        AuthService.register(this.state.name, this.state.lastname, this.state.email,
          this.state.birthdate, this.state.password, this.state.gender,
          this.state.pesel).then(
            response => {
              if(response.status >= 400){
                if(response.status == 400){
                  var message = Validation.handleValidationFetchOutcome(response.errors);
                  this.snackbarRef.current.openSnackBar( message ,'red-snackbar');
                }

                this.snackbarRef.current.openSnackBar( 'Wystąił problem, spróbuj ponownie później' ,'red-snackbar');
              }else{
                this.props.history.push('/');
                window.location.reload();
              }
            }
          );
      }
    });

  }

  handleBlur = (field) => (evt) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    });
  }

  shouldMarkError(field) {

    var hasError = this.state.errors[field];
    const shouldShow = this.state.touched[field];
    return hasError ? shouldShow : false;
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
          className = {this.shouldMarkError('firstName') ? "input error" : "input"}
          name = "name"
          type = "text"
          onBlur={this.handleBlur('name')}
          value = {this.state.name}
          onChange = {this.handleChange}
          />
          </div>
          <div className = "label-input-group flex-column">
          <label htmlFor="lastname" className = "label">Nazwisko</label>
          <input id = "lastname"
          className = {this.shouldMarkError('lastName') ? "input error" : "input"}
          type = "text"
          name = "lastname"
          onBlur={this.handleBlur('lastname')}
          value = {this.state.lastname}
          onChange = {this.handleChange}
          />
          </div>
          </div>
          <div className = "flex-row justify-space-between">
          <div className = "label-input-group flex-column">
          <label htmlFor="birthdate" className = "label">Data Urodzenia</label>
          <input id = "birthdate"
          className = {this.shouldMarkError('dateOfBirth') ? "input error" : "input"}
          type = "date"
          name = "birthdate"
          onBlur={this.handleBlur('birthdate')}
          value = {this.state.birthdate}
          onChange = {this.handleChange}
          />
          </div>
          <div className = "label-input-group flex-column">
          <label htmlFor="gender" className = "label">Płeć</label>
          <input id = "gender"
          className = {this.shouldMarkError('gender') ? "input error" : "input"}
          type = "text"
          name = "gender"
          onBlur={this.handleBlur('gender')}
          value = {this.state.gender}
          onChange = {this.handleChange}
          />
          </div>
          </div>
          <div className = "flex-row justify-space-between">
          <div className = "label-input-group flex-column">
          <label htmlFor="pesel" className = "label">Pesel</label>
          <input id = "pesel"
          className = {this.shouldMarkError('pesel') ? "input error" : "input"}
          type = "number"
          name = "pesel"
          onBlur={this.handleBlur('pesel')}
          value = {this.state.pesel}
          onChange = {this.handleChange}
          />
          </div>
          <div className = "label-input-group flex-column">
          <label htmlFor="email" className = "label">Email</label>
          <input id = "email"
          className = {this.shouldMarkError('email') ? "input error" : "input"}
          type = "text"
          name = "email"
          onBlur={this.handleBlur('email')}
          value = {this.state.email}
          onChange = {this.handleChange}
          />
          </div>
          </div>
          <div className = "flex-row justify-space-between">
          <div className = "label-input-group flex-column">
          <label htmlFor = "password" className = "label">Hasło</label>
          <input
          className = {this.shouldMarkError('password') ? "input error" : "input"}
          type = "password"
          name = "password"
          onBlur={this.handleBlur('password')}
          value = {this.state.password}
          onChange = {this.handleChange}
          />
          </div>
          <div className = "label-input-group flex-column">
          <label htmlFor = "passwordValid" className = "label">Powtórz Hasło</label>
          <input
          className = {this.shouldMarkError('passwordConfirm') ? "input error" : "input"}
          type = "password"
          name = "passwordValid"
          onBlur={this.handleBlur('passwordValid')}
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
            src={Doctor}
            height="300"
             />
        </div>
        <Snackbar ref = {this.snackbarRef} />
      </div>
    );
  }

}
export default Registration;
