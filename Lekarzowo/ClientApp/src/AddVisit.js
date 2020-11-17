import React from 'react';
import Menu from './Menu.js';
import ReservationItem from './components/ReservationItem.js';
import Autocomplete from './components/Autocomplete.js';
import UserService from './services/UserService.js';
import Calendar from 'react-calendar'
import oneSign from './images/1Sign.svg'
import twoSign from './images/2Sign.svg'
import './Main.css';
import 'react-calendar/dist/Calendar.css';

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
          <Calendar />
          </div>

        </div>
      </div>
    </div>


  );
}

}
export default AddVisit
