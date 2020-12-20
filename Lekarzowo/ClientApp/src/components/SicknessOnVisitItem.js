import React from 'react';
import removeSign from '../images/RemoveSign.svg';
import VisitService from '../services/VisitService.js';


class SicknessOnVisitItem extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    id: props.id,
    sicknessName: props.sicknessName,
    sicknessDescription: props.sicknessDescription
  }
  this.deleteSicknessOnVisit = this.deleteSicknessOnVisit.bind(this);
}

deleteSicknessOnVisit(event){
  VisitService.deleteSicknessOnVisit(this.state.id)
  .then(response => {
    console.log('Done');
    this.props.snackbarCallback('Usunięto', 'green-snackbar', 'visitSickness', this.state, 'illnessHistoryId');
  }).catch(err => {
    console.log('Error');
    this.props.snackbarCallback('Nie udało się usuniąć', 'red-snackbar');
  });
}

render() {
  return(
    <div className = 'sickness-on-visit-item'>
        <a>{this.props.sicknessName}</a>
        {this.props.isOpen ?
        <img src = {removeSign} style = {{width: 30, pointer: 'cursor'}} onClick = {this.deleteSicknessOnVisit} />
        :
        <div/>
        }
    </div>

  );
}

}

export default SicknessOnVisitItem;
