import React from 'react';
import Dashboard from './Dashboard'
import Login from './Login'
import Visits from './Visits'
import AuthService from './authentication/AuthService.js'
import Registration from './Registration.js'
import {
  Route,
  NavLink,
  HashRouter,
  Redirect
} from "react-router-dom";

class RegisterContainer extends React.Component {
  constructor(props){
    super(props);
    if(AuthService.getLoggedUser() != null){
      console.log("Already authenticated");
      this.props.history.push('/dashboard');
    }
  }

  render() {
      return(
        <div className="containerLogin">
          <Registration history= {this.props.history}/>
        </div>
      );
  }
}

export default RegisterContainer;
