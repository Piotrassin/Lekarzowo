import React from 'react';

class ReservationItem extends React.Component {
constructor(props){
  super(props);
  this.state = {
    date: '',
    hours: '',
    place: '',
    doctorName: '',
    doctorSurname: '',
    price: ''
  }
}


render(){
  return(

    <div className = "reservation-item">
      <div className = "res-item-part-color">
      </div>
      <div className = "res-item-group">
      <div className = "res-item-part-1">
      <b>20.10.2020</b>
      <a className = "smaller-font">data</a>
      </div>
      <div className = "res-item-part-2">
      <a>12:00 - 12:15</a>
      <a className = "smaller-font">Godziny</a>
      </div>
      <div className = "res-item-part-3">
      <a>HomePark Targówek</a>
      <a className = "smaller-font">Miejsce</a>
      </div>
      <div className = "res-item-part-4">
      <a>Joanna Jędrzejewska</a>
      <a className = "smaller-font">Lekarz</a>
      </div>
      <div className = "res-item-part-5">
      <a>200.00 zł</a>
      <a className = "smaller-font">Cena</a>
      </div>
      <div className = "res-item-part-buttons">
      <button className = "btn-success">Rezerwuj</button>
      </div>
      </div>
    </div>
  );
}

}
export default ReservationItem;
