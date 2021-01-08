import React from 'react';
import Login from './Login';
import AuthService from './authentication/AuthService.js';

class LoginContainer extends React.Component {
  constructor(props){
    super(props);
    if(AuthService.getLoggedUser() != null){
      this.props.history.push('/');
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
