import React from 'react';
import Dashboard from './Dashboard'
//import Main from './Main'
import DateStepper from './DateStepper'
import VisitDetails from './VisitDetails'

class DetailVisit extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
      return(
        <div className="container">
  
          <VisitDetails
          id = {this.props.location.state.dataEdit}/>
        </div>
      );
  }
}

export default DetailVisit;
