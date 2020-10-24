import React from 'react';
import Dashboard from './Dashboard'
import Login from './Login'
import DetailVisit from './DetailVisit'
import Visits from './Visits'
import AuthService from './authentication/AuthService.js'
import {
  Route,
  NavLink,
  HashRouter,
  Redirect
} from "react-router-dom";

class LoginContainer extends React.Component {
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
          <Login history= {this.props.history}/>
        </div>
      );
  }
}

export default LoginContainer;
