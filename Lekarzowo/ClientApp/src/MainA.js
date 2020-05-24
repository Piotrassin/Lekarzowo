import React from 'react';
import Dashboard from './Dashboard'
import Main from './Main'
import DetailVisit from './DetailVisit'
import Visits from './Visits'
import {
  Route,
  NavLink,
  HashRouter,
  Redirect
} from "react-router-dom";

class MainA extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
      return(
        <div className="container">
          <Main />
          <Dashboard />
        </div>
      );
  }
}

export default MainA;
