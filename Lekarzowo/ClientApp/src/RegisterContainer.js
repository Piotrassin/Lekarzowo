import React from 'react';
import AuthService from './authentication/AuthService.js'
import Registration from './Registration.js'

class RegisterContainer extends React.Component {
  constructor(props){
    super(props);
    if(AuthService.getLoggedUser() != null){
      this.props.history.push('/');
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
