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
      <div className = "medicine-holder" style={{marginBottom: '20px'}}>
        <img className = "medicine-image" src = {this.props.image} style={{width: '40px'}}/>
        <div className = "container-medicine-text">
          <b className = "small-white margin-top-small">{this.props.sickness.illnessName}</b>
          <b className = "smaller-dashed margin-top-small">{this.props.sickness.diagnoseDate.split('T')[0]}
           - {this.props.sickness.cureDate}</b>
        </div>

      </div>
    );
  }
}
export default SicknessSmall;
