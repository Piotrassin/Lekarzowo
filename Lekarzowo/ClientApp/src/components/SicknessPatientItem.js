import React from 'react';
import sicknessSign from '../images/SicknessSign.svg';
import Formater from '../helpers/Formater.js';
import UserService from '../services/UserService.js';

class SicknessPatientItem extends React.Component {
constructor(props) {
  super(props);
  this.onClickChangeSickness = this.onClickChangeSickness.bind(this);
}

onClickChangeSickness(event){

  UserService.sicknessEnded(this.props.sickness.illnessHistoryId)
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
      <div className = 'sickness-item-part-small part-1'>
        <img src = {sicknessSign} className = "small-icon" />
      </div>
      <div className = 'sickness-item-part-small part-2' style = {{overflowX: 'auto'}}>
        <div className = 'flex-column'>
        <b>{this.props.sickness.illnessName}</b>
        <a>{this.props.sickness.description}</a>
        </div>
      </div>
      <div className = 'sickness-item-part-small part-3'>
        <div className = 'flex-column'>
        <b>{Formater.formatDate(this.props.sickness.diagnoseDate)}</b>
        <a>Data diagnozy</a>
        </div>
      </div>
      <div className = 'sickness-item-part-small part-4'>
        <div className = 'flex-column'>
        <b>{this.props.sickness.cureDate  == undefined  ? 'brak' : Formater.formatDate(this.props.sickness.cureDate)}</b>
        <a>Data wyleczenia</a>
        </div>
      </div>
      <div className = 'sickness-item-part-small part-5'>
        {this.props.sickness.cureDate == undefined  ?
          <a className = 'button-primary' onClick = {this.onClickChangeSickness}>Choroba zakończona</a>
          :
          <div/>
      }
      </div>
    </div>

  );
}

}

export default SicknessPatientItem;
