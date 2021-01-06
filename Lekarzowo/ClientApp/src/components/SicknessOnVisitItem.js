import React from 'react';
import removeSign from '../images/RemoveSign.svg';
import VisitService from '../services/VisitService.js';
import {Dialog} from './Dialog.js';


class SicknessOnVisitItem extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    id: props.id,
    sicknessName: props.sicknessName,
    sicknessDescription: props.sicknessDescription
  }
  this.deleteSicknessOnVisit = this.deleteSicknessOnVisit.bind(this);
  this.handleClickDeleteSicknessDialogBtn = this.handleClickDeleteSicknessDialogBtn.bind(this);
}

handleClickDeleteSicknessDialogBtn(event){
  VisitService.deleteSicknessOnVisit(this.state.id)
  .then(response => {
    console.log('Done');
    this.props.snackbarCallback('Usunięto', 'green-snackbar', 'visitSickness', this.state, 'illnessHistoryId');
  }).catch(err => {
    console.log('Error');
    this.props.snackbarCallback('Nie udało się usuniąć', 'red-snackbar');
  })
}

deleteSicknessOnVisit(event){
  event.preventDefault();

  Dialog.open("confirm-dialog")(event);
}

render() {
  return(
    <div className = 'sickness-on-visit-item'>
        <div className = 'flex-column'>
        <a>{this.props.sicknessName}</a>
        <a className = 'tiny-dashed'>{this.props.sicknessDescription}</a>
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
            <a className = 'btn-dialog-cancel' onClick={this.handleClick} >Anuluj</a>
            <a className = 'btn-dialog-primary' onClick = {this.handleClickDeleteSicknessDialogBtn}>Zatwierdź</a>
          </div>
        </Dialog>
    </div>

  );
}

}

export default SicknessOnVisitItem;
