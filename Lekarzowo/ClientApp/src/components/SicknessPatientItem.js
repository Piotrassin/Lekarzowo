import React from 'react';
import sicknessSign from '../images/SicknessSign.svg';

class SicknessPatientItem extends React.Component {
constructor(props) {
  super(props);

}



render() {
  return(
    <div className = 'sickness-item' style = {{border: 'none', color: 'white'}}>
      <div className = 'sickness-item-part-small part-1-small'>
        <img src = {sicknessSign} className = "small-icon" />
      </div>
      <div className = 'sickness-item-part-small part-2-3-4-small'>
        <div className = 'flex-column'>
        <b>{this.props.sickness.illnessName}</b>
        <a>{this.props.sickness.description}</a>
        </div>
      </div>

      <div className = 'sickness-item-part-small part-5'>

      </div>
    </div>

  );
}

}

export default SicknessPatientItem;
