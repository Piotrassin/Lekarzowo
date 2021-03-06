import React from 'react';
import sicknessSign from '../images/SicknessSign.svg';

class SicknessItem extends React.Component {
constructor(props) {
  super(props);
  this.onClickShowVisit = this.onClickShowVisit.bind(this);
}

onClickShowVisit(event){
  this.props.history.push('/visit/' + this.props.sickness.visitId);
}

render() {
  return(
    <div className = 'sickness-item'>
      <div className = 'sickness-item-part part-1'>
        <img src = {sicknessSign} className = "small-icon" />
      </div>
      <div className = 'sickness-item-part part-2 overflow-y-auto'>
        <a className = 'text-center'>{this.props.sickness.illness ? this.props.sickness.illness.name : this.props.sickness.illnessName}</a>
      </div>
      <div className = 'sickness-item-part part-3-4 overflow-y-auto'>
        <a className = 'text-center'>{this.props.sickness.description}</a>
      </div>
      <div className = 'sickness-item-part part-5'>
        {this.props.sickness.visitId ?
        <a className = 'button-primary' onClick = {this.onClickShowVisit}>Zobacz Wizytę</a>
        :
        <a/>
      }
      </div>
    </div>

  );
}

}

export default SicknessItem;
