import React from 'react';
import Dashboard from './Dashboard'
import Main from './Main'
import MainA from './MainA'
import DetailVisit from './DetailVisit'
import Visits from './Visits'
import {
  Route,
  NavLink,
  HashRouter,
  Redirect
} from "react-router-dom";

class App extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
      return(
        <HashRouter>
        <div>
        <Route exact path="/" component={MainA}/>
        <Route exact path="/visits" component={Visits}/>
        <Route path="/visit" render={(routeProps) => (
              <DetailVisit {...routeProps}/>
          )}/>
        </div>
        </HashRouter>
      );
  }
}

export default App;
