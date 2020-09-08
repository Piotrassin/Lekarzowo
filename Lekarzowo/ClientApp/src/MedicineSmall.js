import React from 'react';
import './Main.css';

class MedicineSmall extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className = "medicine-holder">
        <img className = "medicine-image"src = {this.props.image} />
        <div className = "container-medicine-text">
          <b className = "standard-white margin-top-small">{this.props.medicineName}</b>
          <b className = "small-dashed margin-top-small">{this.props.dose}</b>
        </div>
      </div>
    );
  }
}
export default MedicineSmall;
