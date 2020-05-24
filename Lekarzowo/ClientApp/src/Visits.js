import React from 'react';
import Dashboard from './Dashboard'
import Main from './Main'
import DateStepper from './DateStepper'

class Visits extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
      return(
        <div className="container">
          <Main />
          <DateStepper />
        </div>
      );
  }
}

export default Visits;
