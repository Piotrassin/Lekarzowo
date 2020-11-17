import React from 'react';
import Menu from './Menu.js';
import ReservationItem from './components/ReservationItem.js';
import Autocomplete from './components/Autocomplete.js';
import UserService from './services/UserService.js';
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
  //this.getCities =
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
            title = "Miasto"
            id = 'city-search'
            />
            <div className = 'space'/>
            <Autocomplete
            requestCallback = {UserService.getSpecializations}
            title = "Specjalizacja"
            />
            <div className = 'space'/>
            <Autocomplete
            requestCallback = {UserService.getDoctors}
            title = "Doktor"
            />
            </div>
            <div className = "res-item-container">
              <ReservationItem
              date = "10.12.2020"
              hours =  "10:00 - 11:00"
              place =  "Home Park Targówek"
              doctorName =  "Joanna"
              doctorSurname = "Jędrzejewska"
              price = "200 zł"
              />
              <ReservationItem
              date = "10.12.2020"
              hours =  "10:00 - 11:00"
              place =  "Home Park Targówek"
              doctorName =  "Joanna"
              doctorSurname = "Jędrzejewska"
              price = "200 zł"
              />
              <ReservationItem
              date = "10.12.2020"
              hours =  "10:00 - 11:00"
              place =  "Home Park Targówek"
              doctorName =  "Joanna"
              doctorSurname = "Jędrzejewska"
              price = "200 zł"
              />
              <ReservationItem
              date = "10.12.2020"
              hours =  "10:00 - 11:00"
              place =  "Home Park Targówek"
              doctorName =  "Joanna"
              doctorSurname = "Jędrzejewska"
              price = "200 zł"
              />
              <ReservationItem
              date = "10.12.2020"
              hours =  "10:00 - 11:00"
              place =  "Home Park Targówek"
              doctorName =  "Joanna"
              doctorSurname = "Jędrzejewska"
              price = "200 zł"
              />
              <ReservationItem
              date = "10.12.2020"
              hours =  "10:00 - 11:00"
              place =  "Home Park Targówek"
              doctorName =  "Joanna"
              doctorSurname = "Jędrzejewska"
              price = "200 zł"
              />
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
                defaultValue="07:30"
                size="small"/>
                <br/>
                <CssTextField variant = "outlined"
                label="Godzina Do"
                type="time"
                defaultValue="22:00"
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
