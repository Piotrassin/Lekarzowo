import React from 'react';
import sicknessSign from '../images/SicknessSign.svg';
import Formater from '../helpers/Formater.js';

class MedicineItem extends React.Component {
constructor(props) {
  super(props);
}

render() {
  return(
    <div className = 'sickness-item' >
      <div className = 'sickness-item-part part-1'>
        <img src = {sicknessSign} className = "small-icon" />
      </div>
      <div className = 'sickness-item-part part-2 overflow-y-auto'>
        <a className = 'text-center'>{this.props.medicine.medicine.name}</a>
      </div>
      <div className = 'sickness-item-part part-3-4 overflow-y-auto'>
        <a className = 'text-center'>{this.props.medicine.description}</a>
      </div>
      <div className = 'sickness-item-part part-5'>
        {this.props.medicine.date ?
        <a>Brak daty -  {Formater.formatDate(this.props.medicine.date)}</a>
        :
        <a>{Formater.formatDate(this.props.medicine.startdate)} - {this.props.medicine.finishdate == null ? 'teraz' : Formater.formatDate(this.props.medicine.finishdate)}</a>
        }

      </div>
    </div>

  );
}

}

export default MedicineItem;
