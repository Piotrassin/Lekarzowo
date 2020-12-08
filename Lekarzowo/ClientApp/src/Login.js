import React from 'react';
import './css/login/login.css';
import doctorDraw from './images/DoctorDraw.svg';
import logo from './images/logo.svg';
import { Route , withRouter} from 'react-router-dom';
import AuthService from './authentication/AuthService.js';
import Snackbar from './helpers/Snackbar.js';

function validate(email, password){
  return {
    email: (!email.includes("@")) && email.length === 0,
    password: password.length === 0
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onRegisterRequest = this.onRegisterRequest.bind(this);
    this.state = {
      email: "",
      password: "",
      waiting: false,
      touched:{
        email: false,
        password: false
      }
    };
  }
  snackbarRef = React.createRef();


  onChangeEmail(event){
    this.setState({
    email: event.target.value
    });
  }

  onChangePassword(event){
    this.setState({
      password: event.target.value
    });
  }

  onRegisterRequest(event){
    this.props.history.push("/signup");
  }

  handleSubmit(event) {
    event.preventDefault();
    //here set the waiitiing and loading values
    AuthService.login(this.state.email, this.state.password).then(
      response => {
        if(response.status >= 400){
          this.snackbarRef.current.openSnackBar('Złe dane logowania');
        }else{
          console.log(response.currentRole.roleName);
          if(response.currentRole.roleName == 'doctor'){
              this.props.history.push('/dashboardDoctor');
              console.log("doctor");
          }
          else{
              this.props.history.push('/');
              console.log("not doctor");
          }
          console.log("Wyszlo Login");
          //window.location.reload();
        }
      }
    );
  }

  handleBlur = (field) => (evt) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    });
  }

  render() {
    const errors = validate(this.state.email, this.state.password);
    const isEnabled = Object.keys(errors).some(x => errors[x]);
    const shouldMarkError = (field) => {
      const hasError = errors[field];
      const shouldShow = this.state.touched[field];
      return hasError ? shouldShow : false;
    };
    return(
      <div className = "loginContainer">
        <div className = "loginPictureContainer">
        <img
            className = "centeredImage"
            src={doctorDraw}
            height="300"
             />
        </div>
        <div className = "loginInputContainer">
        <img
            className = "logo"
            src={logo}
            height="90"
             />
          <form onSubmit = {this.handleSubmit} className = "loginForm">
            <label htmlFor="login" className = "label">Login</label>
            <input id = "login"
            className = {shouldMarkError('email') ? "input error" : "input"}
            type = "text"
            onBlur={this.handleBlur('email')}
            value = {this.state.email}
            onChange = {this.onChangeEmail}
            />
            <label htmlFor = "password" className = "label">Hasło</label>
            <input className = {shouldMarkError('password') ? "input error" : "input"}
            type = "password"
            onBlur={this.handleBlur('password')}
            value = {this.state.password}
            onChange = {this.onChangePassword}
            />
            <br/>
            <button disabled={isEnabled} className = "login-button">Zaloguj</button>
            <a
            onClick = {this.onRegisterRequest}
            class = 'white-link'
            >Nie masz konta?
            </a>
          </form>
        </div>
        <Snackbar ref = {this.snackbarRef} />
      </div>
    )
  }
}
export default Login;
