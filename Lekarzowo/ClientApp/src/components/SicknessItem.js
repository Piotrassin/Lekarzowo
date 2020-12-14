import React from 'react';
import sicknessSign from '../images/SicknessSign.svg';

class SicknessItem extends React.Component {
constructor(props) {
  super(props);
}

render() {
  return(
    <div className = 'sickness-item'>
      <div className = 'sickness-item-part part-1'>
        <img src = {sicknessSign} className = "small-icon" />
      </div>
      <div className = 'sickness-item-part part-2'>
        <a>{this.props.sickness.illness.name}</a>
      </div>
      <div className = 'sickness-item-part part-3-4'>
        <a>{this.props.sickness.description}</a>
      </div>
      <div className = 'sickness-item-part part-5'>
        <a className = 'button-primary'>Zobacz Wizytę</a>
      </div>
    </div>

  );
}

}

export default SicknessItem;
