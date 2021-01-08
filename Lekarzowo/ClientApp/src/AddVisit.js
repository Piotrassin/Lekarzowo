import React from 'react';
import Menu from './Menu.js';
import Calendar from 'react-calendar';
import ReservationItem from './components/ReservationItem.js';
import Autocomplete from './components/Autocomplete.js';
import { Dialog } from './components/Dialog.js';
import ReservationService from './services/ReservationService.js';
import UserService from './services/UserService.js';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Formater from './helpers/Formater.js';
import doctorComputer from './images/DoctorComputer.svg';
import oneSign from './images/1Sign.svg'
import twoSign from './images/2Sign.svg'
import threeSign from './images/3Sign.svg'
import './Main.css';
import './css/helpers/Calendar.css';
import {
  withStyles,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'


const CssTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'grey !important',
      },
    },
  },
})(TextField);

class AddVisit extends React.Component {
constructor(props){
  super(props);

  var defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 1);
  var defaultEndDate = new Date();
  this.state = {
    skipCount: 0,
    cityId: "",
    specialityId: "",
    doctorId: "",
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    startHour: "07:30",
    endHour: "22:00",
    btnTouched: false,
    showLoadMore: false,
    reservationsArray: [],
    selectedReservation: {}
  }

  this.snackbarRef = React.createRef();
  this.onClickDate = this.onClickDate.bind(this);
  this.onClickCity = this.onClickCity.bind(this);
  this.onClickSpeciality = this.onClickSpeciality.bind(this);
  this.onClickDoctor = this.onClickDoctor.bind(this);
  this.onHourChange = this.onHourChange.bind(this);
  this.onSubmitBtnClick = this.onSubmitBtnClick.bind(this);
  this.onReservationClick = this.onReservationClick.bind(this);
  this.onClickLoadMore = this.onClickLoadMore.bind(this);
  this.onClickConfimReservation = this.onClickConfimReservation.bind(this);
}


onClickDate(value) {
  this.setState({
    startDate: value[0],
    endDate: value[1],
    btnTouched: false,
    showLoadMore: false
  });
}

onClickCity(value){
  this.setState({
    cityId: value.id,
    btnTouched: false,
    showLoadMore: false
  });
}

onClickSpeciality(value){
  this.setState({
    specialityId: value.id,
    btnTouched: false,
    showLoadMore: false
  });
}

onClickDoctor(value){
  this.setState({
    doctorId: value.id,
    btnTouched: false,
    showLoadMore: false
  });
}

onHourChange(event) {
  event.persist();
  this.setState({
    [event.target.name]: event.target.value,
    btnTouched: false,
    showLoadMore: false
   })
}

onReservationClick(selectedReservationItem,event) {
  this.setState({
    selectedReservation: selectedReservationItem
  }, () => {
    if(!(Object.keys(this.state.selectedReservation).length === 0)){
      Dialog.open("reservation-dialog")(event);
    }
  });

}

async onSubmitBtnClick(event){
  var startDateNew = new Date(this.state.startDate);
  startDateNew.setDate(startDateNew.getDate() + 1);
  var reservationRequestObject = {
    doctorId: this.state.doctorId,
    specialityId: this.state.specialityId,
    cityId: this.state.cityId,
    startDate: (startDateNew.toISOString().split('T')[0]),
    endDate: (this.state.endDate.toISOString().split('T')[0]),
    startHour: this.state.startHour,
    endHour: this.state.endHour
  };
  this.setState ({
    errors: Validation.validateAddVisit(this.state.cityId, this.state.doctorId, this.state.specialityId,
      this.state.startDate, this.state.endDate)
  }, () => {
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');
    }else {
      ReservationService.getPossibleAppointments(reservationRequestObject, 6).then(resp => {
        this.setState({
          reservationsArray: resp,
          btnTouched: true,
          skipCount: 6
        });
        if(resp.length == 6){
          this.setState({
            showLoadMore: true
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
    }
  });
}

onClickConfimReservation(event){
  ReservationService.postReservation(this.state.selectedReservation)
  .then(response => {
    this.snackbarRef.current.openSnackBar('Dodano rezerwację', 'green-snackbar');
    Dialog.close("reservation-dialog")(event);
  })
  .catch(err => {
      try{
        this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
      }catch(erorr){
        console.log('Missed Reference');
      };
  });
}

onClickLoadMore(event){
  var startDateNew = new Date(this.state.startDate);
  startDateNew.setDate(startDateNew.getDate() + 1);
  var reservationRequestObject = {
    doctorId: this.state.doctorId,
    specialityId: this.state.specialityId,
    cityId: this.state.cityId,
    startDate: (startDateNew.toISOString().split('T')[0]),
    endDate: (this.state.endDate.toISOString().split('T')[0]),
    startHour: this.state.startHour,
    endHour: this.state.endHour
  };
  ReservationService.getPossibleAppointments(reservationRequestObject, 10, this.state.skipCount).then(resp => {
    this.setState({
      reservationsArray: (this.state.reservationsArray).concat(resp),
      btnTouched: true,
      skipCount: this.state.skipCount + 10
    });
    if(resp.length < 10){
      this.setState({
        showLoadMore: false
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
}

render() {
  return (
    <div className = 'container'>
    <Menu history= {this.props.history}/>
      <div className = 'content-container'>
        <div className = 'top-bar'>
          <div className = 'space-hor'/>
          <a className = 'header-profile' style = {{marginLeft: "20px"}}>Zapisz się na wizytę</a>
        </div>
        <div className = 'flex-row rest-container'>
          <div className = 'reservation-container'>
            <div className = 'rest-padding'>
              <div className = 'container-header'>
                <img src = {oneSign} className = "addSign" style = {{width: 25, marginRight: "10px"}} />
                <a>Wybierz filtry</a>
              </div>
              <div className = 'filter-container flex-row'>
                <Autocomplete
                requestCallback = {UserService.getCities}
                changeCallback = {this.onClickCity}
                title = "Miasto"
                id = 'city-search'
                cssId = 'async-cities'
                variant = 'outlined'
                dataTestId="autocomplete-cities"
                />
                <div className = 'space'/>
                <Autocomplete
                requestCallback = {UserService.getSpecializations}
                title = "Specjalizacja"
                changeCallback = {this.onClickSpeciality}
                cssId = 'async-speciality'
                variant = 'outlined'
                dataTestId="autocomplete-speciality"
                />
                <div className = 'space'/>
                <Autocomplete
                requestCallback = {UserService.getDoctors}
                title = "Doktor"
                changeCallback = {this.onClickDoctor}
                cssId = 'async-doctors'
                variant = 'outlined'
                dataTestId="autocomplete-doctor"
                />
              </div>
              <div className = "res-item-container">
                {this.state.btnTouched ? this.state.reservationsArray.map((item, i) =>
                <ReservationItem key={i}
                  reservation = {item}
                  onClickHandler = {this.onReservationClick}
                />
                )
                : <div className = "flex-column img-container"><img src = {doctorComputer} className = "doctor-sign" /></div>
                }
              </div>
              {(this.state.btnTouched && this.state.showLoadMore) ?
              <div className = 'flex-row justify-center' style={{marginTop: '20px'}}>
                <button className = "btn-success-arrow" onClick = {this.onClickLoadMore}>Załaduj więcej</button>
              </div>
              : <div/>}
            </div>
          </div>
          <div className = 'calendar-container flex-column'>
            <div className = 'container-header'>
              <img src = {twoSign} className = "addSign" style = {{width: 25, marginRight: "10px"}} />
              <a style = {{color: "#1859A6"}}>Wybierz Datę</a>
            </div>
            <br/><br/>
            <Calendar
            className = 'calendar-custom'
            selectRange
            onChange = {this.onClickDate}
            />
            <br/>
            <div className = 'container-header'>
              <img src = {threeSign} className = "addSign" style = {{width: 25, marginRight: "10px"}} />
              <a style = {{color: "#1859A6"}}>Wybierz Godziny</a>
            </div><br/>
            <div className="flex-column">
              <CssTextField variant = "outlined"
              label="Godzina Od"
              type="time"
              value = {this.state.startHour}
              onChange = {this.onHourChange}
              name = "startHour"
              size="small"/>
              <br/>
              <CssTextField variant = "outlined"
              label="Godzina Do"
              type="time"
              value = {this.state.endHour}
              onChange = {this.onHourChange}
              name = "endHour"
              size="small"/>
            </div>
            <br/>
            <div className = "btn-container">
              <button className = "btn-primary" onClick={this.onSubmitBtnClick}>Szukaj</button>
            </div>
          </div>
        </div>
      </div>
      <Dialog id = "reservation-dialog">
        <div className = "header-dialog">Potwierdź Rezerwację</div>
          <div className = 'padding-small'>
            <div className = 'subheader-profile'>
              <a>Rezerwacja</a>
              <hr/>
            </div>
            <div className = 'profile-data-slot'>
              <a className = 'profile-data-slot-header'>Lekarz</a>
              <a>{this.state.selectedReservation.doctorName} {this.state.selectedReservation.doctorLastname}</a>
            </div>
            <div className = 'profile-data-slot'>
              <a className = 'profile-data-slot-header'>Data</a>
              <a>{Formater.formatDate(this.state.selectedReservation.start)}</a>
            </div>
            <div className = 'profile-data-slot'>
              <a className = 'profile-data-slot-header'>Godziny</a>
              <a>{Formater.formatHour(this.state.selectedReservation.start)} - {Formater.formatHour(this.state.selectedReservation.end)}</a>
            </div>
            <div className = 'profile-data-slot'>
              <a className = 'profile-data-slot-header'>Wybrana placówka</a>
              <a>{this.state.selectedReservation.localName}</a>
            </div>
          </div>
          <div className = "dialog-btn-hold">
            <button className = "btn-primary" style = {{marginRight: '20px'}} onClick = {this.onClickConfimReservation}>Potwierdź</button>
          </div>
      </Dialog>
      <Snackbar ref = {this.snackbarRef} />
    </div>
  );
}

}
export default AddVisit
