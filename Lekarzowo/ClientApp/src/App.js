import React from 'react';
import Dashboard from './Dashboard';
import MainContainer from './MainContainer';
import LoginContainer from './LoginContainer';
import RegisterContainer from './RegisterContainer';
import VisitDetails from './VisitDetails.js';
import AddVisit from './AddVisit';
import Visits from './Visits';
import Profile from './Profile';
import DashboardDoctor from './doctorView/DashboardDoctor.js';
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
        <Route exact path="/visits" component={Visits}/>
        <Route exact path="/" component={MainContainer}/>
        <AuthorizedRoute exact path="/addVisit" component={AddVisit} roles={'patient'} />
        <Route exact path="/myProfile" component={Profile}/>
        <AuthorizedRoute path="/dashboardDoctor" component={DashboardDoctor} roles={'doctor'} />
        <Route path="/visit" render={(routeProps) => (
              <VisitDetails {...routeProps}/>
          )}/>
        </div>
        </HashRouter>
      );
  }
}

export default App;
