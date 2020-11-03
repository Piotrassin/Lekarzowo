import React from 'react';
import Dashboard from './Dashboard'
import Menu from './Menu.js';
import DateStepper from './DateStepper'

class Visits extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
      return(
        <div className = 'container'>
        <Menu history= {this.props.history}/>
          <DateStepper
          type = "0"
          title = "Wizyty Nadchodzące"
          class = "appointment"/>
          <DateStepper
          type = "1"
          title = "Wizyty Poprzednie"
          class = "appointment-dashed"/>
        </div>
      );
  }
}

export default Visits;
