import React from 'react';
import './Main.css';

class MedicineBigger extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className = "medicine-holder">
        <img className = "medicine-image"src = {this.props.image} />
        <div className = "container-medicine-text">
          <b className = "standard-black margin-top-small" style = {{marginLeft: 0}}>{this.props.medicineName} | {this.props.dose}</b>
          <b className = "small-black margin-top-small">{this.props.medicineHistoryDescription}</b>
        </div>
      </div>
    );
  }
}
export default MedicineBigger;
