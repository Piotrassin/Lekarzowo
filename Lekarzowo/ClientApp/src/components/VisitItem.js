import React from 'react';


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
    <div className = 'sickness-item' style = {{height: '70px'}}>
      <div className = 'sickness-item-part part-1'>
        <a>{this.props.visit.reservationStartTime.split('T')[0]}</a>
      </div>
      <div className = 'sickness-item-part part-2'>
        <a>{this.props.visit.reservationStartTime.split('T')[1]} -
        {this.props.visit.reservationEndTime.split('T')[1]}</a>
      </div>
      <div className = 'sickness-item-part part-3'>
        <a>{this.props.role == 'doctor' ? this.props.visit.localName : this.props.visit.doctorSpecialization}</a>
      </div>
      <div className = 'sickness-item-part part-4'>
        <a>{this.props.role == 'doctor' ? this.props.visit.patientName : this.props.visit.doctorName} {this.props.role == 'doctor' ? this.props.visit.patientLastname : this.props.visit.doctorLastname}</a>
      </div>
      <div className = 'sickness-item-part part-5 flex-column'>
        {this.props.upcomingVisit  ?
          <a className = 'button-gold' onClick = {this.onClickVisitCancel}>Odwołaj</a>
          :
          <a/>
        }
        {(!this.props.upcomingVisit || this.props.role == 'doctor') ?
          <a className = 'button-primary' onClick = {this.onClickVisitDetails} style = {{marginBottom: '5px'}}>Zobacz</a>
          :
          <a/>
        }
      </div>
    </div>

  );
}

}

export default VisitItem;
