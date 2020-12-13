import React from 'react';


class VisitItem extends React.Component {
constructor(props) {
  super(props);
  this.onClickVisitDetails = this.onClickVisitDetails.bind(this);
}

onClickVisitDetails(event) {
  this.props.history.push('/visit/' + this.props.visit.reservationId);
  //window.location.reload();
}

render() {
  return(
    <div className = 'sickness-item'>
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
      <div className = 'sickness-item-part part-5'>
        <a className = 'button-gold' onClick = {this.onClickVisitDetails}>Zobacz</a>
      </div>
    </div>

  );
}

}

export default VisitItem;
