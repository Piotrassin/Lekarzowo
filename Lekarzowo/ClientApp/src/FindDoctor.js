import React from 'react';
import Dashboard from './Dashboard'
import Menu from './Menu.js';
import { withStyles } from '@material-ui/core/styles';
import DateStepper from './DateStepper'
import VisitItem from './components/VisitItem.js';
import Switch from '@material-ui/core/Switch';
import ReservationService from './services/ReservationService.js';
import VisitService from './services/VisitService.js';
import AuthService from './authentication/AuthService';
import VisitAlert from './components/VisitAlert.js';
import TextField from '@material-ui/core/TextField';
import DoctorItem from './components/DoctorItem.js';
import DoctorService from './services/DoctorService.js';


class FindDoctor extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      doctorSearch: "",
      doctorsArray: []
    };
    this.onChangeDoctorSearch = this.onChangeDoctorSearch.bind(this);
  }

  componentDidMount() {

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
      });
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
                name = {doctor.name.concat(' ' + doctor.lastname)}
                />
              ))}

            </div>
            <div className = 'flex-row doctor-details-container'>
            <div  className = 'doctor-sidebar-profile '>
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
              <a className = 'profile-data-slot-header'>Imię</a><a>Andrzej</a>
              </div>
              <div className = 'profile-data-slot'>
              <a className = 'profile-data-slot-header'>Nazwisko</a><a>Andrzejewski</a>
              </div>
              <div className = 'profile-data-slot'>
              <a className = 'profile-data-slot-header'>Email</a><a>a@a.a</a>
              </div>
              <div className = 'profile-data-slot'>
              <a className = 'profile-data-slot-header'>PESEL</a><a>9089786854</a>
              </div>
            </div>
            <div  className = 'doctor-sidebar-details-profile'>
              <a className = 'subheader-content-profile'>Lokale i godzin pracy lekarza</a>
            </div>
            </div>
          </div>
          <VisitAlert history= {this.props.history}/>
        </div>
      );
  }
}

export default FindDoctor;
