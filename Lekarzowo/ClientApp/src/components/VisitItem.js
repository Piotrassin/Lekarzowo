import React from 'react';
import Formater from '../helpers/Formater.js';


class VisitItem extends React.Component {
constructor(props) {
  super(props);
  this.onClickVisitDetails = this.onClickVisitDetails.bind(this);
  this.onClickVisitCancel = this.onClickVisitCancel.bind(this);
}
                                                                                                                                             
onClickVisitDetails(event) {
  this.props.history.push('/visit/' + this.props.visit.reservationId);
  //window.location.reload();
}

onClickVisitCancel(event) {
  this.props.dialogCallback(this.props.visit, event);
}

render() {
  return(
    <div className = {this.props.visit.isCanceled ? 'sickness-item sickness-item-canceled' : 'sickness-item'} style = {{height: '70px'}}>
      <div className = 'sickness-item-part part-1'>
        <a>{Formater.formatDate(this.props.visit.reservationStartTime)}</a>
      </div>
      <div className = 'sickness-item-part part-2'>
        <a>{Formater.formatHour(this.props.visit.reservationStartTime)} - {Formater.formatHour(this.props.visit.reservationEndTime)}</a>
      </div>
      <div className = 'sickness-item-part part-3'>
        <a>{this.props.role == 'doctor' ? this.props.visit.localName : this.props.visit.doctorSpecialization}</a>
      </div>
      <div className = 'sickness-item-part part-4'>
        <a>{this.props.role == 'doctor' ? this.props.visit.patientName : this.props.visit.doctorName} {this.props.role == 'doctor' ? this.props.visit.patientLastname : this.props.visit.doctorLastname}</a>
      </div>
      <div className = 'sickness-item-part part-5 flex-column'>
      {this.props.visit.isCanceled ?
        <div className = 'status-info status-info-red'>
        Odwołano
        </div>
        :
        <div style = {{display: 'flex', flexDirection: 'column'}}>
        {this.props.upcomingVisit  ?
          <a className = 'button-gold' onClick = {this.onClickVisitCancel} style = {{marginBottom: '5px'}}>Odwołaj</a>
          :
          <a/>
        }
        {(!this.props.upcomingVisit || this.props.role == 'doctor') ?
          <a className = 'button-primary' onClick = {this.onClickVisitDetails} >Zobacz</a>
          :
          <a/>
        }
        </div>
      }

      </div>
    </div>

  );
}

}

export default VisitItem;
