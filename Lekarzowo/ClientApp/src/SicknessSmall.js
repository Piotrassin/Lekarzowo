import React from 'react';
import './Main.css';

class SicknessSmall extends React.Component {
  constructor(props){
    super(props);
    if(this.props.sickness.cureDate == null){
      this.props.sickness.cureDate = 'teraz';
    }
  }

  render() {
    return (
      <div className = "sickness-holder">
        <b className = "standard-blue margin-top-small">{this.props.sickness.illnessName}</b>
        <b className = "small-dark margin-top-small">{this.props.sickness.diagnoseDate.split('T')[0]}
         - {this.props.sickness.cureDate}</b>
      </div>
    );
  }
}
export default SicknessSmall;
