import React from 'react';
import sicknessSign from '../images/SicknessSign.svg';

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
        <a>{this.props.medicine.medicineName}</a>
      </div>
      <div className = 'sickness-item-part part-3-4'>
        <a>{this.props.medicine.medicineDosage}</a>
      </div>
      <div className = 'sickness-item-part part-5'>
        
      </div>
    </div>

  );
}

}

export default MedicineItem;
