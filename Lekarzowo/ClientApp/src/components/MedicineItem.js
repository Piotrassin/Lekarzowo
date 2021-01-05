import React from 'react';
import sicknessSign from '../images/SicknessSign.svg';
import Formater from '../helpers/Formater.js';

class MedicineItem extends React.Component {
constructor(props) {
  super(props);
}

render() {
  return(
    <div className = 'sickness-item'>
      <div className = 'sickness-item-part part-1'>
        <img src = {sicknessSign} className = "small-icon" />
      </div>
      <div className = 'sickness-item-part part-2'>
        <a>{this.props.medicine.medicine.name}</a>
      </div>
      <div className = 'sickness-item-part part-3'>
        <a>{this.props.medicine.description}</a>
      </div>
      <div className = 'sickness-item-part part-4'>
        <a>{Formater.formatDate(this.props.medicine.startdate)} - {this.props.medicine.finishdate == null ? 'teraz' : Formater.formatDate(this.props.medicine.finishdate)}</a>
      </div>
      <div className = 'sickness-item-part part-5'>

      </div>
    </div>

  );
}

}

export default MedicineItem;
