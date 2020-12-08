import React from 'react';
import DownArrow from '../images/DownArrow.svg';
import UserIcon from '../images/UserIcon.svg';
import DoctorIcon from '../images/DoctorIcon.svg';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AuthService from '../authentication/AuthService.js';

class RoleButton extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    value: null
  };
  this.onchangeUserRole = this.onchangeUserRole.bind(this);
  this.handleCloseRoleBtn = this.handleCloseRoleBtn.bind(this);
}

handleRedirect(){
  var role = AuthService.getUserCurrentRole();
  var redirectPath = "/";
  switch(role){
    case 'patient': redirectPath = "/"; break;
    case 'doctor': redirectPath = '/dashboardDoctor'; break;
    case 'admin': redirectPath = '/'; break;
  }
  this.props.history.push(redirectPath);
  window.location.reload();
}

onchangeUserRole(event){
  console.log(event.currentTarget);
  this.setState({
    value: event.currentTarget
  });
}

handleCloseRoleBtn(event) {
  event.preventDefault();


 AuthService.changeRole(event.currentTarget.id)
  .then(response => {
      console.log(response.state);
      if(response.state == 0){
        console.log("Udalo sie");
        this.handleRedirect();
      }else {
        console.log("Nie udało się");
      }
  })
  this.setState({
    value: null
  });
}

render() {
  const user = AuthService.getUser();
  return(
    <div>
      <Button onClick = {this.onchangeUserRole} className = "btn-roles">
        {AuthService.getUserCurrentRole() == 'doctor' ?
          <img src = {DoctorIcon} style = {{width: '30px', marginRight: '10px'}} />
          :
          <img src = {UserIcon} style = {{width: '30px', marginRight: '10px'}} />
        }
        {user.firstName}
        <img src = {DownArrow} style = {{width: '13px', marginLeft: '5px'}} />
      </Button>
      <Menu
      className = 'role-menu'
      id="role-menu"
      anchorEl={this.state.value}
      keepMounted
      open={Boolean(this.state.value)}
      onClose={this.handleCloseRoleBtn}
      >
        {AuthService.getUserRoles().map((el,id) =>
          <MenuItem
          onClick={this.handleCloseRoleBtn}
          id = {el}
          >
            {el}

          </MenuItem>
        )}
    </Menu>
  </div>

  );
}

}

export default RoleButton;
