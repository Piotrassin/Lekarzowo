import Menu from './Menu.js';
import Dashboard from './Dashboard.js'
import React from 'react';
import './Main.css';

class MainContainer extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return(
      <div className = 'container'>
      <Menu history= {this.props.history}/>
      <Dashboard history= {this.props.history}/>
      </div>
    );
  }
}
export default MainContainer;
