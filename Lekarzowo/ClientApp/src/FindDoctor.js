import React from 'react';
import Dashboard from './Dashboard'
import Menu from './Menu.js';
import { withStyles } from '@material-ui/core/styles';
import VisitItem from './components/VisitItem.js';
import Switch from '@material-ui/core/Switch';
import ReservationService from './services/ReservationService.js';
import VisitService from './services/VisitService.js';
import AuthService from './authentication/AuthService';
import VisitAlert from './components/VisitAlert.js';
import TextField from '@material-ui/core/TextField';
import DoctorItem from './components/DoctorItem.js';
import DoctorService from './services/DoctorService.js';
import Formater from './helpers/Formater.js';
import Snackbar from './helpers/Snackbar.js';

class FindDoctor extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      doctorSearch: "",
      doctorsArray: [],
      doctorWorkingHoursArray: [],
      doctor: null
    };
    this.onChangeDoctorSearch = this.onChangeDoctorSearch.bind(this);
    this.onClickDoctor = this.onClickDoctor.bind(this);
    this.getDayofWeek = this.getDayofWeek.bind(this);
    this.snackbarRef = React.createRef();
  }

  componentDidMount() {

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
            doctorWorkingHoursArray: [],
            doctor: null
          });
        }
      })
      .catch(err => {
          try{
  this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
}catch(erorr){
  console.log('Missed Reference');
};
      });
    });
  }

  onClickDoctor(id) {
    console.log(id);
    this.setState({
      doctorWorkingHoursArray: []
    });
    DoctorService.getDoctor(id)
    .then(response => {
      this.setState({
        doctor: response[0]
      });
    })
    .catch(err => {
        try{
  this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
}catch(erorr){
  console.log('Missed Reference');
};
    });
    DoctorService.getDoctorWorkingHours(id, 7)
    .then(response => {
      this.setState({
        doctorWorkingHoursArray: response
      });
    })
    .catch(err => {
        try{
  this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
}catch(erorr){
  console.log('Missed Reference');
};
    });
  }



  render() {
      return(
        <div className = 'container'>
        <Menu history= {this.props.history}/>
          <div className = 'doctor-find-container flex-column'>
            <div className = 'doctor-cart-header flex-column'>
            <a className = 'subheader-content-profile'>Wyszukaj lekarza</a>
            <br/>
            <TextField id="searchDoctor" name="searchDoctor"
            label="Doktor"
            value = {this.state.doctorSearch}
            onChange = {this.onChangeDoctorSearch}
            size="small" fullWidth />
            </div>
            <div className = 'flex-row doctor-item-container'>
            {this.state.doctorsArray && this.state.doctorsArray.map((doctor, index ) => (
                <DoctorItem
                id = {doctor.id}
                key = {doctor.id}
                name = {doctor.name.concat(' ' + doctor.lastname)}
                clickCallback = {this.onClickDoctor}
                />
              ))}

            </div>

            <div className = 'flex-row doctor-details-container'>
            {this.state.doctor != null ?
            <div  className = 'doctor-sidebar-profile '>
              <a className = 'subheader-profile-doctor'>{this.state.doctor.name}
              </a>
              <a className = 'subheader-profile-doctor'>{this.state.doctor.lastname}
              </a>
              <br/>
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
            :
            <div/>
            }
            {this.state.doctorWorkingHoursArray.length > 0 ?
            <div  className = 'doctor-sidebar-details-profile'>
              <a className = 'subheader-content-profile'>Lokale i godziny pracy lekarza</a>
              <br/>
              <div className = 'workinghours-container'>
              {this.state.doctorWorkingHoursArray && this.state.doctorWorkingHoursArray.map((local, index ) => (
              <div>
                <a className = 'subheading-content-profile'>{local.name} ({local.streetname} {local.streetnumber})</a>
                <hr style = {{width: '100%'}}/>
                {local.workinghours.map((workinghours, index) =>
                <div className = 'profile-data-slot' style = {{width: '60%', color: 'black'}}>
                  <a className = 'profile-data-slot-header' style = {{color: 'black'}}>{this.getDayofWeek(workinghours.from)} ({Formater.formatDate(workinghours.from)})
                  </a><a>{Formater.formatHour(workinghours.from)} - {Formater.formatHour(workinghours.to)}</a>
                </div>
                )}

              </div>
              ))}
              </div>
            </div>

            :
            <div/>
          }
          </div>
          </div>
          <VisitAlert history= {this.props.history}/>
          <Snackbar ref = {this.snackbarRef} />
        </div>
      );
  }
}

export default FindDoctor;
