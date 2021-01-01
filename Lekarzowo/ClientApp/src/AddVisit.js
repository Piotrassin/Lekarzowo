import React from 'react';
import Menu from './Menu.js';
import ReservationItem from './components/ReservationItem.js';
import Autocomplete from './components/Autocomplete.js';
import UserService from './services/UserService.js';
import ReservationService from './services/ReservationService.js';
import { Dialog } from './components/Dialog.js';
import doctorComputer from './images/DoctorComputer.svg';
import Calendar from 'react-calendar'
import oneSign from './images/1Sign.svg'
import twoSign from './images/2Sign.svg'
import threeSign from './images/3Sign.svg'
import smallDoctor from './images/SmallDoctor.svg'
import './Main.css';
import './css/helpers/Calendar.css';
import {
  withStyles,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';


const CssTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'grey !important',
      },
      '& label': {
      color: 'green !important',
      },
      '&:hover fieldset': {
        borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    },
  },
})(TextField);

class AddVisit extends React.Component {
constructor(props){
  super(props);
  this.onClickDate = this.onClickDate.bind(this);
  this.onClickCity = this.onClickCity.bind(this);
  this.onClickSpeciality = this.onClickSpeciality.bind(this);
  this.onClickDoctor = this.onClickDoctor.bind(this);
  this.onHourChange = this.onHourChange.bind(this);
  this.onSubmitBtnClick = this.onSubmitBtnClick.bind(this);
  this.onReservationClick = this.onReservationClick.bind(this);
  this.onClickLoadMore = this.onClickLoadMore.bind(this);
  this.onClickConfimReservation = this.onClickConfimReservation.bind(this);
  this.formatHour = this.formatHour.bind(this);
  this.formatDate = this.formatDate.bind(this);
  var defaultStartDate = new Date();
  var defaultEndDate = new Date();
  defaultStartDate.setHours(7,30);
  defaultEndDate.setHours(22,0);
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
    reservationsArray: [],
    selectedReservation: {}
  }
}
snackbarRef = React.createRef();

onClickDate(value) {
  this.setState({
    startDate: value[0],
    endDate: value[1]
  });
  console.log(value[0]);
  console.log(value[1]);
}

onClickCity(value){
  console.log("outside");
  console.log(value);
  this.setState({
    cityId: value.id
  });
}

onClickSpeciality(value){
  console.log("outside");
  console.log(value);
  this.setState({
    specialityId: value.id
  });
}

onClickDoctor(value){
  console.log("outside");
  console.log(value);
  this.setState({
    doctorId: value.id
  });
}

onReservationClick(selectedReservationItem,event) {
  console.log(selectedReservationItem);
  this.setState({
    selectedReservation: selectedReservationItem
  }, () => {
    if(!(Object.keys(this.state.selectedReservation).length === 0)){
      console.log(this.state.selectedReservation);
      Dialog.open("reservation-dialog")(event);
    }
  });

}

onHourChange(event) {
  event.persist();
  this.setState({ [event.target.name]: event.target.value });
  console.log(event.target.name);
  console.log(event.target.value);

}

performValidation(){

}

async onSubmitBtnClick(event){
  console.log("DoctorId " + this.state.doctorId);
  console.log("SpecId " + this.state.specialityId);
  console.log("CityId " + this.state.cityId);
  console.log("DateStarrt " + this.state.startDate);
  console.log("DateEnd " + this.state.endDate);
  //Add 1 day to Startdate
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
    console.log(this.state.errors);
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
      })
      .catch(err => {
        if(err.message ==  401){
          this.snackbarRef.current.openSnackBar('Nie masz dostępu do tego zasobu.', 'red-snackbar');
        }else {
          this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
        }
      });
    }
  });


  console.log('Reservation Request object');
  console.log(reservationRequestObject);
}

onClickConfimReservation(event){
  ReservationService.postReservation(this.state.selectedReservation)
  .then(response => {
    console.log(response);
    if(response.status == 400) {
      response.errors.map((error) => {
        this.snackbarRef.current.openSnackBar(error, 'red-snackbar');
      })

    }
    this.snackbarRef.current.openSnackBar('Dodano rezerwację', 'green-snackbar');
    Dialog.close("reservation-dialog")(event);
  })
  .catch(err => {
    if(err.message ==  401){
      this.snackbarRef.current.openSnackBar('Nie masz dostępu do tego zasobu.', 'red-snackbar');
    }else {
      this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
    }
  });
}

onClickLoadMore(event){
  console.log('before');
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
    console.log('setting state');

    this.setState({
      reservationsArray: (this.state.reservationsArray).concat(resp),
      btnTouched: true,
      skipCount: this.state.skipCount + 10
    });
    console.log(this.state.reservationsArray);
  })
  .catch(err => {
    if(err.message ==  401){
      this.snackbarRef.current.openSnackBar('Nie masz dostępu do tego zasobu.', 'red-snackbar');
    }else {
      this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
    }
  });
}

formatDate(date) {
  if(date != undefined) {
    return date.split('T')[0];
  }
  return '';
}

formatHour(date) {
  if(date != undefined){
    return date.split('T')[1].slice(0, -3);
  }
  return '';
}

render() {
  return (
    <div className = 'container'>
    <Menu history= {this.props.history}/>
      <div className = 'content-container'>
        <div className = 'top-bar'>
        <div className = 'space-hor'/>
        <a className = 'header-profile' style = {{marginLeft: "20px"}}>Zapisz się na wizytę
        </a>
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
            />
            <div className = 'space'/>
            <Autocomplete
            requestCallback = {UserService.getSpecializations}
            title = "Specjalizacja"
            changeCallback = {this.onClickSpeciality}
            cssId = 'async-cities'
            variant = 'outlined'
            />
            <div className = 'space'/>
            <Autocomplete
            requestCallback = {UserService.getDoctors}
            title = "Doktor"
            changeCallback = {this.onClickDoctor}
            cssId = 'async-cities'
            variant = 'outlined'
            />
            </div>
            <div className = "res-item-container">
            {this.state.btnTouched
              ? this.state.reservationsArray.map((item, i) =>
                <ReservationItem key={i}
                  reservation = {item}
                  onClickHandler = {this.onReservationClick}
                />
              )
              : <div className = "flex-column img-container"><img src = {doctorComputer} className = "doctor-sign" /></div>
            }
            </div>
            {this.state.btnTouched
              ?
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
        <div className = 'flex-columm'>
        <div className = 'flex-row-space-around margin-top-medium' style = {{marginTop: '20px'}}>
          <a className = 'dialog-title'>Lekarz: </a>
          <a>{this.state.selectedReservation.doctorName} {this.state.selectedReservation.doctorLastname}</a>
        </div>
        <div className = 'flex-row-space-around margin-top-medium'>
          <a className = 'dialog-title' >Data: </a>
          <a>{this.formatDate(this.state.selectedReservation.start)}</a>
        </div>
        <div className = 'flex-row-space-around margin-top-medium'>
          <a className = 'dialog-title' >Godziny: </a>
          <a>{this.formatHour(this.state.selectedReservation.start)} -
          {this.formatHour(this.state.selectedReservation.end)}</a>
        </div>
        <div className = 'flex-row-space-around margin-top-medium'>
          <a className = 'dialog-title' >Wybrana placówka: </a>
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
