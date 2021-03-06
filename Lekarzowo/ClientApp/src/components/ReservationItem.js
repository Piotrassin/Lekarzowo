import React from 'react';
import arrowSign from '../images/ArrowSign.svg'
import Formater from '../helpers/Formater.js';

class ReservationItem extends React.Component {
constructor(props){
  super(props);
  this.onClickReservationBtn=this.onClickReservationBtn.bind(this);

}

onClickReservationBtn(event){
  event.preventDefault();
  this.props.onClickHandler(this.props.reservation, event);

}


render(){
  return(

    <div className = "reservation-item">
      <div className = "res-item-group">
      <div className = "res-item-part-1">
      <b>{Formater.formatDate(this.props.reservation.start)}</b>
      <a className = "smaller-font">data</a>
      </div>
      <div className = "res-item-part-2">
      <a>{Formater.formatHour(this.props.reservation.start)} - {Formater.formatHour(this.props.reservation.end)}</a>
      <a className = "smaller-font">Godziny</a>
      </div>
      <div className = "res-item-part-3">
      <a>{this.props.reservation.localName}</a>
      <a className = "smaller-font">Miejsce</a>
      </div>
      <div className = "res-item-part-4">
      <a>{this.props.reservation.doctorName} {this.props.reservation.doctorLastname}</a>
      <a className = "smaller-font">Lekarz</a>
      </div>

      <div className = "res-item-part-buttons">
      <button className = "btn-success-arrow" onClick={this.onClickReservationBtn}>
        <img src = {arrowSign} className = "addSign" style = {{width: 15}} />
      </button>
      </div>
      </div>
    </div>
  );
}

}
export default ReservationItem;
