import React from "react";
import Menu from './Menu.js';
import sicknessSign from './images/SicknessSign.svg';
import doctorDraw from './images/DoctorDraw.svg';
import ProfileUserEdit from './ProfileUserEdit.js';
import ProfileSickness from './ProfileSickness.js';
import ProfileMedicine from './ProfileMedicine.js';
import UserService from './services/UserService.js';
import AuthService from './authentication/AuthService.js';

class Profile extends React.Component {
constructor(props){
  super(props);
  this.onClickEditUser = this.onClickEditUser.bind(this);
  this.onClickSickShow = this.onClickSickShow.bind(this);
  this.onClickMedShow = this.onClickMedShow.bind(this);
  this.state = {
    isEditUser: true,
    isSickShow: false,
    isMedShow: false,
    user: {
      name: "",
      lastname: "",
      birthdate: "",
      pesel: ""
    }
  }
}

onClickEditUser(event) {
  event.preventDefault();
  this.setState({
    isEditUser: true,
    isSickShow: false,
    isMedShow: false
  });
  console.log("klik");
}

onClickSickShow(event) {
  event.preventDefault();
  this.setState({
    isEditUser: false,
    isSickShow: true,
    isMedShow: false
  });
}

onClickMedShow(event) {
  event.preventDefault();
  this.setState({
    isEditUser: false,
    isSickShow: false,
    isMedShow: true
  });
}

componentDidMount(){
  UserService.getUserData()
  .then(response => {
      this.setState({
        user: {
          name: response.name,
          lastname: response.lastname,
          birthdate: response.birthdate.split('T')[0],
          pesel: response.pesel
        }
      });
  });

}


  render (){
    return(
      <div className = 'container'>
      <Menu history= {this.props.history}/>
      <div  className = 'sidebar-profile'>
        <a className = 'header-profile'>{this.state.user.name}
        </a>
        <a className = 'header-profile' style = {{marginTop: '5px'}}>{this.state.user.lastname}
        </a>
        <br/>
        <div className = 'status-info status-info-green'>
          <a>{AuthService.getUserCurrentRole()}</a>
        </div>

        <div className = 'subheader-profile'>
        <a>Dane Osobiste</a>
        <hr/>
        </div>
        <div className = 'profile-data-slot'>
        <a className = 'profile-data-slot-header'>Imię</a><a>{this.state.user.name}</a>
        </div>
        <div className = 'profile-data-slot'>
        <a className = 'profile-data-slot-header'>Nazwisko</a><a>{this.state.user.lastname}</a>
        </div>
        <div className = 'profile-data-slot'>
        <a className = 'profile-data-slot-header'>Data Urodzenia</a><a>{this.state.user.birthdate}</a>
        </div>
        <div className = 'profile-data-slot'>
        <a className = 'profile-data-slot-header'>PESEL</a><a>{this.state.user.pesel}</a>
        </div>
        <div className = 'profile-right-btn-holder'>
        <a className="button-primary">Edytuj</a>
        </div>

        <div className = 'profile-img-holder'>
        <img
            className = "centeredImage"
            src={doctorDraw}
            height="150"
             />
        </div>
      </div>
      <div className = 'flex-column profile-right-holder'>
      <div className = 'pofile-menu'>
        <a className = {"profile-menu-part " + (this.state.isEditUser ? 'menu-show' : '')} onClick = {this.onClickEditUser}>Dane Osobowe</a>
        <a className = {"profile-menu-part " + (this.state.isSickShow ? 'menu-show' : '')} onClick = {this.onClickSickShow}>Przebyte Choroby</a>
        <a className = {"profile-menu-part " + (this.state.isMedShow ? 'menu-show' : '')} onClick = {this.onClickMedShow}>Przyjmowane Leki</a>
      </div>
      {this.state.isEditUser && <ProfileUserEdit />}
      {this.state.isSickShow && <ProfileSickness history= {this.props.history} />}
      {this.state.isMedShow && <ProfileMedicine />}
      </div>
      </div>

    );
  }
}
export default Profile;
