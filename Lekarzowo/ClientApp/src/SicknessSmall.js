import React from 'react';
import './Main.css';

class SicknessSmall extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className = "sickness-holder">
        <b className = "standard-blue margin-top-small">{this.props.sicknessName}</b>
        <b className = "small-dark margin-top-small">{this.props.dateStart} - {this.props.dateEnd}</b>
      </div>
    );
  }
}
export default SicknessSmall;
