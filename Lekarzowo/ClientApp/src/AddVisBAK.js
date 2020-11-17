import React from 'react';
import Menu from './Menu.js';
import ReservationItem from './components/ReservationItem.js';
import Autocomplete from './components/Autocomplete.js';
import UserService from './services/UserService.js';

class AddVisit extends React.Component {
constructor(props){
  super(props);
  //this.getCities =
}



render() {
  return (
    <div className = 'container'>
    <Menu history= {this.props.history}/>
    <div className = "sidebar-profile">
        <a className = "header-2">Wybierz kryteria</a>
        <br/>
        <Autocomplete
        requestCallback = {UserService.getCities}
        title = "Miasto"
        id = 'city-search'
        />
<br/>
        <Autocomplete
        requestCallback = {UserService.getSpecializations}
        title = "Specjalizacja"
        />
        <br/>
        <Autocomplete
        requestCallback = {UserService.getDoctors}
        title = "Doktor"
        />

        <br/>
        <button className = "login-button">Zastosuj</button>
    </div>
    <div className = "main-date-picker">
    <h1>Biig Header</h1>
    <ReservationItem />
    <ReservationItem />
    <ReservationItem />
    <ReservationItem />
    <ReservationItem />
    </div>
    </div>


  );
}

}
export default AddVisit
