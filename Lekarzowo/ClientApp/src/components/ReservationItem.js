import React from 'react';
import arrowSign from '../images/ArrowSign.svg'

class ReservationItem extends React.Component {
constructor(props){
  super(props);
  this.state = {
    date: this.props.date,
    hours: this.props.hours,
    place: this.props.place,
    doctorName: this.props.doctorName,
    doctorSurname: this.props.doctorSurname,
    price: this.props.price
  }
}


render(){
  return(

    <div className = "reservation-item">
      <div className = "res-item-group">
      <div className = "res-item-part-1">
      <b>{this.state.date}</b>
      <a className = "smaller-font">data</a>
      </div>
      <div className = "res-item-part-2">
      <a>{this.state.hours}</a>
      <a className = "smaller-font">Godziny</a>
      </div>
      <div className = "res-item-part-3">
      <a>{this.state.place}</a>
      <a className = "smaller-font">Miejsce</a>
      </div>
      <div className = "res-item-part-4">
      <a>{this.state.doctorName} {this.state.doctorSurname}</a>
      <a className = "smaller-font">Lekarz</a>
      </div>
      <div className = "res-item-part-5">
      <a>{this.state.price}</a>
      <a className = "smaller-font">Cena</a>
      </div>
      <div className = "res-item-part-buttons">
      <button className = "btn-success-arrow">
        <img src = {arrowSign} className = "addSign" style = {{width: 15}} />
      </button>
      </div>
      </div>
    </div>
  );
}

}
export default ReservationItem;
