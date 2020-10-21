import React from 'react';
import Dashboard from './Dashboard'
import Main from './Main'
import Login from './Login'
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
        <div className="containerLogin">

          <Login />
        </div>
      );
  }
}

export default MainA;
