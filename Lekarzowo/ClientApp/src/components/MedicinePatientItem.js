import React from 'react';
import sicknessSign from '../images/SicknessSign.svg';

class MedicinePatientItem extends React.Component {
constructor(props) {
  super(props);
  this.onClickChangeMedicine = this.onClickChangeMedicine.bind(this);
}

onClickChangeMedicine(event){
  //this.props.history.push('/visit/' + this.props.sickness.visitId);
}

render() {
  return(
    <div className = 'sickness-item' style = {{border: 'none', color: 'white'}}>
      <div className = 'sickness-item-part-small part-1-small'>
        <img src = {sicknessSign} className = "small-icon" />
      </div>
      <div className = 'sickness-item-part-small part-2-3-4-small'>
        <div className = 'flex-column'>
        <b>{this.props.medicineName}</b>
        <a>{this.props.dose}</a>
        </div>
      </div>

      <div className = 'sickness-item-part-small part-5'>
        <a className = 'button-primary' onClick = {this.onClickChangeMedicine}>Pacjent nie przyjmuje</a>
      </div>
    </div>

  );
}

}

export default MedicinePatientItem;
