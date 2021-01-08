import React from 'react';
import backArrow from './images/BackArrow.svg';
import AuthService from './authentication/AuthService.js';
import TextField from '@material-ui/core/TextField';
import DoctorPublicItem from './components/DoctorPublicItem.js';
import DoctorService from './services/DoctorService.js';
import Formater from './helpers/Formater.js';
import Snackbar from './helpers/Snackbar.js';

class FindDoctorContainer extends React.Component {
  constructor(props){
    super(props);

    if(AuthService.getLoggedUser() != null){
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
    this.onClickBack = this.onClickBack.bind(this);
    this.snackbarRef = React.createRef();
  }

  onClickBack(event){
    this.props.history.push('/login');
  }

  onChangeDoctorSearch(event){
    this.setState({
      doctorSearch: event.target.value
    }, () => {
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
        <div className="containerLogin" style = {{position: 'relative'}}>
          <a  className = 'back-public-button' style={{color: 'white', cursor: 'pointer'}} onClick={this.onClickBack}><img src = {backArrow} style={{width: '12px'}}/> Powrót</a>
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
            <div className = 'flex-row doctor-item-container overflow-x-auto' style = {{marginTop: '0px'}}>
              {this.state.doctorsArray && this.state.doctorsArray.map((doctor, index ) => (
              <DoctorPublicItem
              id = {doctor.id}
              key = {doctor.id}
              name = {doctor.name.concat(' ' + doctor.lastname)}
              clickCallback = {this.onClickDoctor}
              />
              ))}
            </div>
            <div className = 'flex-row doctor-details-container' style={{height: '36vh'}}>
            {this.state.doctor != null ?
            <div  className = 'doctor-sidebar-profile ' style = {{height: '100%'}}>
              <a className = 'subheader-profile-doctor'>{this.state.doctor.name}
              </a>
              <a className = 'subheader-profile-doctor'>{this.state.doctor.lastname}
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
            :
            <div/>
            }
            {this.state.doctorWorkingHoursArray.length > 0 ?
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
                    <a className = 'profile-data-slot-header' style = {{color: 'black'}}>{Formater.getDayofWeek(workinghours.from)} ({Formater.formatDate(workinghours.from)})</a><a>{Formater.formatHour(workinghours.from)} - {Formater.formatHour(workinghours.to)}</a>
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
        <Snackbar ref = {this.snackbarRef} />
      </div>
      );
  }
}

export default FindDoctorContainer;
