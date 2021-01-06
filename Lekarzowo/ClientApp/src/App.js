import React from 'react';
import Dashboard from './Dashboard';
import DashboardContainer from './DashboardContainer';
import LoginContainer from './LoginContainer';
import RegisterContainer from './RegisterContainer';
import FindDoctorContainer from './FindDoctorContainer';
import VisitDetails from './VisitDetails.js';
import AddVisit from './AddVisit';
import Visits from './Visits';
import Profile from './Profile';
import FindDoctor from './FindDoctor';
import AdminPanel from './AdminPanel';
import DashboardDoctor from './doctorView/DashboardDoctor.js';
import PatientHistory from './PatientHistory.js';
import  { AuthorizedRoute } from './AuthorizedRoute.js';
import {
  Route,
  NavLink,
  HashRouter,
  Redirect,
  withRouter
} from "react-router-dom";

class App extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
      return(
        <HashRouter>
        <div>
        <Route exact path="/login" component={LoginContainer}/>
        <Route exact path="/signup" component={RegisterContainer}/>
        <Route exact path='/findDoctorPublic' component={FindDoctorContainer} />
        <AuthorizedRoute exact path="/visits" component={Visits} roles={['patient', 'doctor']}/>
        <AuthorizedRoute exact path="/" component={DashboardContainer} roles={['patient']}/>
        <AuthorizedRoute exact path="/addVisit" component={AddVisit} roles={'patient'} />
        <AuthorizedRoute exact path="/myProfile" component={Profile} roles={['patient', 'doctor', 'admin']}/>
        <AuthorizedRoute exact path="/findDoctor" component={FindDoctor} roles={['patient', 'doctor', 'admin']}/>
        <AuthorizedRoute path="/dashboardDoctor" component={DashboardDoctor} roles={'doctor'} />
        <AuthorizedRoute path="/patientHistoryMore" component={PatientHistory} roles={'doctor'} />
        <AuthorizedRoute path="/adminPanel" component={AdminPanel} roles={'admin'} />
        <AuthorizedRoute path="/visit" roles={['patient', 'doctor']} component = {VisitDetails}/>
        </div>
        </HashRouter>
      );
  }
}

export default App;
