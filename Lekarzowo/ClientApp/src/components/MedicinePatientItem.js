import React from 'react';
import medicine1 from '../images/MedicineSmallRound.svg';
import UserService from '../services/UserService.js';
import Formater from '../helpers/Formater.js';

class MedicinePatientItem extends React.Component {
constructor(props) {
  super(props);
  this.onClickChangeMedicine = this.onClickChangeMedicine.bind(this);
}

onClickChangeMedicine(event){

  UserService.medicineNoLongerTaken(this.props.medicine)
  .then(response => {
    window.location.reload();
  })
  .catch(err => {
    this.props.snackbarCallback(err.message, 'red-snackbar');
    console.log(err.message);
  })
}

render() {
  return(
    <div className = 'sickness-item' style = {{border: 'none', color: 'white'}}>
      <div className = 'sickness-item-part-small part-1-small'>
        <img src = {medicine1} className = "small-icon" />
      </div>
      <div className = 'sickness-item-part-small part-2' style = {{overflowX: 'auto'}}>
        <div className = 'flex-column'>
        <b>{this.props.medicineName}</b>
        <a>{this.props.dose}</a>
        </div>
      </div>
      <div className = 'sickness-item-part-small part-3'>
        <div className = 'flex-column'>
        <b>{Formater.formatDate(this.props.medicine.startdate)}</b>
        <a>Data rozpoczęcia</a>
        </div>
      </div>
      <div className = 'sickness-item-part-small part-4'>
        <div className = 'flex-column'>
        <b>{this.props.medicine.finishdate  == undefined  ? 'teraz' : Formater.formatDate(this.props.medicine.finishdate)}</b>
        <a>Data zakończenia</a>
        </div>
      </div>
      <div className = 'sickness-item-part-small part-5'>
        {this.props.finishDate == undefined  ?
          <a className = 'button-primary' onClick = {this.onClickChangeMedicine}>Pacjent nie przyjmuje</a>
          :
          <div/>
      }
      </div>
    </div>

  );
}

}

export default MedicinePatientItem;
