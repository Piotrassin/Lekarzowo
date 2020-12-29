import React from 'react';
import removeSign from '../images/RemoveSign.svg';
import VisitService from '../services/VisitService.js';


class TreatmentOnVisitItem extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    id: props.id,
    treatmentName: props.treatmentName,
    treatmentDescription: props.treatmentDescription
  }
  this.deleteTreatmentOnVisit = this.deleteTreatmentOnVisit.bind(this);
}

deleteTreatmentOnVisit(event){
  VisitService.deleteTreatmentOnVisit(this.state.id)
  .then(response => {
    console.log('Done');
    this.props.snackbarCallback('Usunięto', 'green-snackbar', 'visitTreatment', this.state, 'id');
  }).catch(err => {
    console.log('Error');
    this.props.snackbarCallback('Nie udało się usuniąć', 'red-snackbar');
  });
}

render() {
  return(
    <div className = 'sickness-on-visit-item'>
        <div className = 'flex-column'>
        <a>{this.props.treatmentName}</a>
        <a className = 'tiny-dashed'>{this.props.treatmentDescription}</a>
        </div>
        {this.props.isOpen ?
        <img src = {removeSign} style = {{width: 30, pointer: 'cursor'}} onClick = {this.deleteTreatmentOnVisit} />
        :
        <div/>
        }
    </div>

  );
}

}

export default TreatmentOnVisitItem;
