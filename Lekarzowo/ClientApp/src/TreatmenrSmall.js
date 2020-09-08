import React from 'react';
import './Main.css';

class TreatmenrSmall extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className = "treatment-holder">
        <b className = "standard-white margin-top-small">{this.props.treatmentName}</b>
        <b className = "small-dashed margin-top-small">{this.props.treatmentOnVisitDescription}</b>
      </div>
    );
  }
}
export default TreatmenrSmall;
