import React from 'react';
import Dashboard from './Dashboard'
import Login from './Login'
import DetailVisit from './DetailVisit'
import Visits from './Visits'
import AuthService from './authentication/AuthService.js'
import FindDoctor from './FindDoctor.js'
import TextField from '@material-ui/core/TextField';
import DoctorPublicItem from './components/DoctorPublicItem.js';
import DoctorService from './services/DoctorService.js';
import {
  Route,
  NavLink,
  HashRouter,
  Redirect
} from "react-router-dom";

class FindDoctorContainer extends React.Component {
  constructor(props){
    super(props);
    if(AuthService.getLoggedUser() != null){
      console.log("Already authenticated");
      this.props.history.push('/');
    }
    this.state = {
      doctorSearch: "",
      doctorsArray: [],
      doctorWorkingHoursArray: [],
      doctor: null
    };
    this.onChangeDoctorSearch = this.onChangeDoctorSearch.bind(this);
    this.onClickDoctor = this.onClickDoctor.bind(this);
    this.getDayofWeek = this.getDayofWeek.bind(this);
    this.onClickBack = this.onClickBack.bind(this);
  }

  getDayofWeek(dateToChange){
    var d = new Date(dateToChange);
    var weekday = new Array(7);
    weekday[0] = "Niedziela";
    weekday[1] = "Poniedziałek";
    weekday[2] = "Wtorek";
    weekday[3] = "Środa";
    weekday[4] = "Czwartek";
    weekday[5] = "Piątek";
    weekday[6] = "Sobota";

    return weekday[d.getDay()];
  }

  onClickBack(event){
    this.props.history.push('/login');
  }

  onChangeDoctorSearch(event){
    this.setState({
      doctorSearch: event.target.value
    }, () => {
      console.log(this.state.doctorSearch);
      DoctorService.getDoctors(this.state.doctorSearch, 6,0)
      .then(response => {
        this.setState({
          doctorsArray: response
        });
        if(this.state.doctorWorkingHoursArray.length > 0){
          this.setState({
            doctorWorkingHoursArray: []
          });
        }
      });
    });
  }

  onClickDoctor(id) {
    console.log(id);
    DoctorService.getDoctor(id)
    .then(response => {
      this.setState({
        doctor: response[0]
      });
    });
    DoctorService.getDoctorWorkingHours(id, 7)
    .then(response => {
      this.setState({
        doctorWorkingHoursArray: response
      });
    });
  }

  render() {
      return(
        <div className="containerLogin" style = {{position: 'relative'}}>
          <button className = 'back-public-button' onClick = {this.onClickBack}>
          Powrót
          </button>
          <div className = "loginContainer flex-column">
            <div className = 'doctor-cart-header flex-column'>
              <a className = 'subheader-content-profile'>Wyszukaj lekarza</a>
              <br/>
              <TextField id="searchDoctor" name="searchDoctor"
              label="Doktor"
              value = {this.state.doctorSearch}
              onChange = {this.onChangeDoctorSearch}
              size="small" fullWidth />
            </div>
            <div className = 'flex-row doctor-item-container' style = {{marginTop: '0px'}}>
              {this.state.doctorsArray && this.state.doctorsArray.map((doctor, index ) => (
                <DoctorPublicItem
                id = {doctor.id}
                key = {doctor.id}
                name = {doctor.name.concat(' ' + doctor.lastname)}
                clickCallback = {this.onClickDoctor}
                />
              ))}
            </div>
            {this.state.doctorWorkingHoursArray.length > 0 ?
            <div className = 'flex-row doctor-details-container' style={{height: '36vh'}}>
            <div  className = 'doctor-sidebar-profile ' style = {{height: '100%'}}>
              <a className = 'subheader-profile-doctor'>Andrzej
              </a>
              <a className = 'subheader-profile-doctor'>Andrzejewski
              </a>
              <div className = 'status-info status-info-green'>
                <a>Doktor</a>
              </div>
              <div className = 'subheader-profile'>
              <a>Dane Osobiste</a>
              <hr/>
              </div>
              <div className = 'profile-data-slot'>
              <a className = 'profile-data-slot-header'>Imię</a><a>{this.state.doctor.name}</a>
              </div>
              <div className = 'profile-data-slot'>
              <a className = 'profile-data-slot-header'>Nazwisko</a><a>{this.state.doctor.lastname}</a>
              </div>
              <div className = 'profile-data-slot'>
              <a className = 'profile-data-slot-header'>Email</a><a>{this.state.doctor.email}</a>
              </div>
            </div>
            <div  className = 'doctor-sidebar-details-profile' style = {{height: '100%'}}>
              <a className = 'subheader-content-profile'>Lokale i godziny pracy lekarza</a>
              <br/>
              <div className = 'workinghours-container'>
              {this.state.doctorWorkingHoursArray && this.state.doctorWorkingHoursArray.map((local, index ) => (
              <div>
                <a className = 'subheading-content-profile'>{local.name} ({local.streetname} {local.streetnumber})</a>
                <hr style = {{width: '100%'}}/>
                {local.workinghours.map((workinghours, index) =>
                <div className = 'profile-data-slot' style = {{width: '300px', color: 'black'}}>
                  <a className = 'profile-data-slot-header' style = {{color: 'black'}}>{this.getDayofWeek(workinghours.from)}</a><a>{workinghours.from.split('T')[1]} -
                  {workinghours.to.split('T')[1]}</a>
                </div>
                )}

              </div>
              ))}
              </div>
            </div>
            </div>
            :
            <div/>
          }
          </div>
        </div>
      );
  }
}

export default FindDoctorContainer;
