import React from 'react';
import removeSign from '../images/RemoveSign.svg';
import VisitService from '../services/VisitService.js';


class MedicineOnVisitItem extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    illnessHistoryId: props.illnessHistoryId,
    medicineId: props.medicineId,
    id: props.startDate,
    medicineName: props.medicineName,
    medicineDescription: props.medicineDescription
  }
  this.deleteMedicineOnVisit = this.deleteMedicineOnVisit.bind(this);
}

deleteMedicineOnVisit(event){
  VisitService.deleteMedicineOnVisit(this.state.illnessHistoryId, this.state.medicineId, this.state.id)
  .then(response => {
    console.log('Done');
    this.props.snackbarCallback('Usunięto', 'green-snackbar', 'visitMedicine', this.state, 'startDate');
  }).catch(err => {
    console.log('Error');
    this.props.snackbarCallback('Nie udało się usuniąć', 'red-snackbar');
  });
}

render() {
  return(
    <div className = 'sickness-on-visit-item'>
        <a>{this.props.medicineName}</a>
        {this.props.isOpen ?
        <img src = {removeSign} style = {{width: 30, pointer: 'cursor'}} onClick = {this.deleteMedicineOnVisit} />
        :
        <div/>
        }
    </div>

  );
}

}

export default MedicineOnVisitItem;
