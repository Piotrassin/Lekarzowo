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
  var defaultStartDate = new Date();
  var defaultEndDate = new Date();
  defaultStartDate.setHours(7,30);
  defaultEndDate.setHours(22,0);
  this.state = {
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
  var splittedHours = event.target.value.split(":");
  if(event.target.name == "startHour"){
    this.state.startDate.setHours(splittedHours[0], splittedHours[1]);
  }else {
    this.state.endDate.setHours(splittedHours[0], splittedHours[1]);
  }
}

async onSubmitBtnClick(event){
  console.log("DoctorId " + this.state.doctorId);
  console.log("SpecId " + this.state.specialityId);
  console.log("CityId " + this.state.cityId);
  console.log("DateStarrt " + this.state.startDate);
  console.log("DateEnd " + this.state.endDate);
  await ReservationService.getPossibleAppointments(this.state.cityId, this.state.specialityId, this.state.doctorId,
  this.state.startDate, this.state.endDate, 6).then(resp => {
    this.setState({
      reservationsArray: resp,
      btnTouched: true
    });
  })
}

onClickConfimReservation(event){

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
            />
            <div className = 'space'/>
            <Autocomplete
            requestCallback = {UserService.getSpecializations}
            title = "Specjalizacja"
            changeCallback = {this.onClickSpeciality}
            cssId = 'async-cities'
            />
            <div className = 'space'/>
            <Autocomplete
            requestCallback = {UserService.getDoctors}
            title = "Doktor"
            changeCallback = {this.onClickDoctor}
            cssId = 'async-cities'
            />
            </div>
            <div className = "res-item-container">
            {this.state.btnTouched
              ? this.state.reservationsArray.map((item, i) =>
                <ReservationItem key={i}
                  date={item.start.split("T")[0]}
                  hours={item.start.split("T")[1].substr(0,5).concat(" - ", item.end.split("T")[1].substr(0,5))}
                  place={item.localName}
                  doctorName = {item.doctorName}
                  doctorSurname = {item.doctorLastname}
                  onClickHandler = {this.onReservationClick}
                />
              )
              : <div className = "flex-column img-container"><img src = {doctorComputer} className = "doctor-sign" /></div>
            }
            </div>
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
          <a>{this.state.selectedReservation.doctorName} {this.state.selectedReservation.doctorSurname}</a>
        </div>
        <div className = 'flex-row-space-around margin-top-medium'>
          <a className = 'dialog-title' >Data: </a>
          <a>{this.state.selectedReservation.date}</a>
        </div>
        <div className = 'flex-row-space-around margin-top-medium'>
          <a className = 'dialog-title' >Godziny: </a>
          <a>{this.state.selectedReservation.hours}</a>
        </div>
        <div className = 'flex-row-space-around margin-top-medium'>
          <a className = 'dialog-title' >Wybrana placówka: </a>
          <a>{this.state.selectedReservation.place}</a>
        </div>
        </div>
        <div className = "dialog-btn-hold">
          <button className = "btn-primary" style = {{marginRight: '20px'}}>Potwierdź</button>
        </div>
      </Dialog>
    </div>


  );
}

}
export default AddVisit