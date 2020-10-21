import React from 'react';
import './css/login/login.css';
import doctorDraw from './images/DoctorDraw.svg';
import logo from './images/logo.svg';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit () {

  }

  render() {
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
            <label for="login" className = "label">Login</label>
            <input id = "login"
            className = "input"
            type = "text" />
            <label className = "label">Hasło</label>
            <input className = "input"
            type = "password" />
            <br/>
            <button className = "login-button">Zaloguj</button>
          </form>
        </div>
      </div>
    )
  }
}
export default Login;
