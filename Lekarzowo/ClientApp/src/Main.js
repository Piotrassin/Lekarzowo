import React  from "react"
import Sidebar from "react-sidebar"
import './Main.css';
import logo from './Logo.png';
import addSign from './images/AddSign.png'

class Main extends React.Component {
  constructor(props){
    super(props);
    console.log(this.state.sidebarOpen)
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  //this.test = this.test.bind(this)
  }
  state = {
    sidebarOpen: true
  }

  onSetSidebarOpen(open) {
    console.log("jestem");
    this.setState({ sidebarOpen: open });
  }



  render() {
    return(
/*
      <Sidebar
      className = "side-menu"
      docked
      sidebar = {
        <div className = "side-menu">
        <img src = {logo} className = "imge"/>
        <div className = "icons">
        <img src = {addSign} className = "addSign" style = {{width: 25}} />
        <img src = {addSign} className = "addSign" style = {{width: 25}} />
        </div>
        </div>
      }
      open = {this.state.sidebarOpen}
      onSetOpen = {this.onSetSidebarOpen}

      children = {<div></div>}
      >
      </Sidebar>
*/
<div className = "side-menu">
<img src = {logo} className = "imge"/>
<div className = "icons">
<img src = {addSign} className = "addSign" style = {{width: 25}} />

</div>

</div>
    );
  }

}
export default Main;
