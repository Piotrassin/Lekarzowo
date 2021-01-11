import React from 'react';
import removeSign from '../images/RemoveSign.svg';
import VisitService from '../services/VisitService.js';
import {Dialog} from './Dialog.js';


class SicknessOnVisitItem extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    id: props.id,
    confirm: false
  }
  this.deleteSicknessOnVisit = this.deleteSicknessOnVisit.bind(this);
  this.handleClickDeleteSicknessDialogBtn = this.handleClickDeleteSicknessDialogBtn.bind(this);
  this.handleConfirmButton = this.handleConfirmButton.bind(this);
}

handleClickDeleteSicknessDialogBtn(){
  console.log('Element ma ID ' + this.state.id);
  console.log('Element ma ID PROPS ' + this.props.id);
  VisitService.deleteSicknessOnVisit(this.state.id)
  .then(response => {
    console.log('Done');
    console.log('Usuniety Element ma ID ' + this.state.id);
    // Dialog.close("confirm-dialog")(event);
    this.props.snackbarCallback('Usunięto', 'green-snackbar', 'visitSickness', {id: this.props.id, sicknessName: this.props.sicknessName, sicknessDescription: this.props.sicknessDescription}, 'illnessHistoryId');
    this.props.reloadMedicineCallback();
  }).catch(err => {
    console.log('Error');
    this.props.snackbarCallback('Nie udało się usuniąć', 'red-snackbar');
  })
}

handleConfirmButton(event){
  this.setState({
    confirm: true
  });
}

deleteSicknessOnVisit(event){

  console.log('ID DO USUNIECA' + this.props.id);
  if (window.confirm("Usunięcie choroby spowoduje usunięcie wszystkich powiązanych z nią leków. Czy chcesz kontynuowac?")) {
    this.handleClickDeleteSicknessDialogBtn();
  }
  //Dialog.open("confirm-dialog")(event);
  //this.handleClickDeleteSicknessDialogBtn(event);
}

render() {
  return(
    <div className = 'sickness-on-visit-item'>
        <div className = 'flex-column'>
        <a>{this.props.sicknessName}</a>
        <a className = 'tiny-dashed'>{this.props.sicknessDescription} {this.props.id} {this.state.id}</a>
        </div>
        {this.props.isOpen ?
        <img src = {removeSign} style = {{width: 30, pointer: 'cursor'}} onClick = {this.deleteSicknessOnVisit} />
        :
        <div/>
        }
        <Dialog id = "confirm-dialog">
          <div className = "header-dialog">
            <a>Czy jesteś pewien?</a>
          </div>
          <br/>
          <div className = 'flex-column'>
          <a className = 'dialog-margin dialog-text' >Usunięcie choroby spowoduje usunięcie wszystkich</a>
          <a className = 'dialog-margin dialog-text'> powiązanych z nią leków.</a>
          </div>

          <div className = 'dialog-btn-hold'>
            <a className = 'btn-dialog-primary' onClick = {this.handleConfirmButton}>Zatwierdź</a>
          </div>
        </Dialog>
    </div>

  );
}

}

export default SicknessOnVisitItem;
