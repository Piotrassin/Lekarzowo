import React from 'react';
import Menu from './Menu.js';
import ReservationItem from './components/ReservationItem.js';

class AddVisit extends React.Component {
constructor(props){
  super(props);
}

render() {
  return (
    <div className = 'container'>
    <Menu history= {this.props.history}/>
    <div className = "sidebar-filter">
        <a className = "header-2">Wybierz kryteria</a>
        <a className = "header-4">Miasto</a>
        <input id = "city"
        className = "input"
        type = "text"
        onChange = {this.onChangeEmail}
        />
        <a className = "header-4">Specjalizacja</a>
        <input id = "city"
        className = "input"
        type = "text"
        onChange = {this.onChangeEmail}
        />
        <a className = "header-4">Lekarz</a>
        <input id = "city"
        className = "input"
        type = "text"
        onChange = {this.onChangeEmail}
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
