import React from 'react';
import Dashboard from './Dashboard'
import MainContainer from './MainContainer'
import LoginContainer from './LoginContainer'
import DetailVisit from './DetailVisit'
import Visits from './Visits'
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
        <Route exact path="/" component={LoginContainer}/>
        <Route exact path="/visits" component={Visits}/>
        <Route exact path="/dashboard" component={MainContainer}/>
        <Route path="/visit" render={(routeProps) => (
              <DetailVisit {...routeProps}/>
          )}/>
        </div>
        </HashRouter>
      );
  }
}

export default App;
