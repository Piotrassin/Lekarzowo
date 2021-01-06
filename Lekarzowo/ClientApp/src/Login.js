import React from 'react';
import './css/login/login.css';
import doctorDraw from './images/DoctorDraw.svg';
import logo from './images/logo.svg';
import { Route , withRouter} from 'react-router-dom';
import AuthService from './authentication/AuthService.js';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      waiting: false,
      touched:{
        email: false,
        password: false
      }
    };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onRegisterRequest = this.onRegisterRequest.bind(this);
    this.onFindDoctorRequest = this.onFindDoctorRequest.bind(this);
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

  onFindDoctorRequest(event){
    this.props.history.push("/findDoctorPublic")
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState ({
      errors: Validation.validateLogin(this.state.email, this.state.password)
    }, () => {
      if(Object.keys(this.state.errors).length > 0){
        var message = Validation.handleValidationOutcome(this.state.errors);
        this.snackbarRef.current.openSnackBar( message ,'red-snackbar');
      }else {
        AuthService.login(this.state.email, this.state.password).then(
          response => {
            console.log(response.currentRole);
              switch(response.currentRole){
                case 'doctor':
                  this.props.history.push('/dashboardDoctor');
                  break;
                case 'patient':
                  this.props.history.push('/');
                  break;
                case 'admin':
                  this.props.history.push('/adminPanel');
                  break;
              }
              //window.location.reload();
          })
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

  render() {
    return(
      <div className = "loginContainer">
        <div className = "loginPictureContainer">
          <img className = "centeredImage" src={doctorDraw} height="300"/>
        </div>
        <div className = "loginInputContainer">
          <img className = "logo" src={logo} height="90" />
          <form onSubmit = {this.handleSubmit} className = "loginForm">
            <label htmlFor="login" className = "label">Login</label>
            <input id = "login"
            className = "input"
            type = "text"
            value = {this.state.email}
            onChange = {this.onChangeEmail}
            />
            <label htmlFor = "password" className = "label">Hasło</label>
            <input className = "input"
            type = "password"
            value = {this.state.password}
            onChange = {this.onChangePassword}
            />
            <br/>
            <button className = "login-button">Zaloguj</button>
            <a onClick = {this.onRegisterRequest} class = 'white-link' >Nie masz konta?</a>
            <a onClick = {this.onFindDoctorRequest} class = 'white-link' >Znajdz naszych lekarzy</a>
          </form>
        </div>
        <Snackbar ref = {this.snackbarRef} />
      </div>
    )
  }
}
export default Login;
