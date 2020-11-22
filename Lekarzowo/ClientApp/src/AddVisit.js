import React from 'react';
import Menu from './Menu.js';
import ReservationItem from './components/ReservationItem.js';
import Autocomplete from './components/Autocomplete.js';
import UserService from './services/UserService.js';
import doctorComputer from './images/DoctorComputer.svg';
import Calendar from 'react-calendar'
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
  this.state = {
    cityId: "",
    specialityId: "",
    doctorId: "",
    startDate: new Date(),
    endDate: new Date(),
    startHour: "07:30",
    endHour: "22:00",
    btnTouched: false
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

onClickCity(valueId){
  console.log("outside");
  console.log(valueId);
  this.setState({
    cityId: valueId
  });
}

onClickSpeciality(valueId){
  console.log("outside");
  console.log(valueId);
  this.setState({
    specialityId: valueId
  });
}

onClickDoctor(valueId){
  console.log("outside");
  console.log(valueId);
  this.setState({
    doctorId: valueId
  });
}


onHourChange(event) {
  event.persist();
  this.setState({ [event.target.name]: event.target.value });
  console.log(event.target.name);
  console.log(event.target.value);
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

            />
            <div className = 'space'/>
            <Autocomplete
            requestCallback = {UserService.getSpecializations}
            title = "Specjalizacja"
            changeCallback = {this.onClickSpeciality}
            />
            <div className = 'space'/>
            <Autocomplete
            requestCallback = {UserService.getDoctors}
            title = "Doktor"
            changeCallback = {this.onClickDoctor}
            />
            </div>
            <div className = "res-item-container">
            {this.state.btnTouched
              ? <div></div>
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
                <button className = "btn-primary">Szukaj</button>
              </div>
            </div>
        </div>
      </div>
    </div>


  );
}

}
export default AddVisit
