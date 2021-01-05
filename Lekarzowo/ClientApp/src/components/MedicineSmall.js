import React from 'react';
import '../Main.css';

class MedicineSmall extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className = "medicine-holder" style={{marginBottom: '10px'}}>
        <img className = "medicine-image" src = {this.props.image} style={{width: '40px'}}/>
        <div className = "container-medicine-text">
          <b className = "small-white margin-top-small">{this.props.medicineName}</b>
          <b className = "smaller-dashed margin-top-small">{this.props.dose}</b>
        </div>
      </div>
    );
  }
}
export default MedicineSmall;
