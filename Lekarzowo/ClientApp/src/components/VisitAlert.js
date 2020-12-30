import React from 'react';
import sicknessSign from '../images/SicknessSign.svg';
import VisitService from '../services/VisitService.js';

class VisitAlert extends React.Component {
constructor(props) {
  super(props);
  this.onClickRedirect = this.onClickRedirect.bind(this);
}

onClickRedirect(event){
  if(VisitService.checkIfAnyOpenVisit()){
    this.props.history.push('/visit/' + VisitService.getOpenedVisit().id);
  }
  
}



render() {
  return(
    <div className = {VisitService.checkIfAnyOpenVisitLocal() ? 'visit-alert' : 'visit-alert visible-none'}>
      <b style = {{fontSize: "18px"}} class = 'flash-text '>Masz otwartą wizytę</b>
      <a style = {{textDecoration: "underline", cursor: "pointer"}} onClick = {this.onClickRedirect}>Kliknij tu aby powrócic</a>
    </div>

  );
}

}

export default VisitAlert;
