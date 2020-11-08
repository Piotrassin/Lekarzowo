import React  from "react"
import Sidebar from "react-sidebar"
import './Main.css';
import AuthService from './authentication/AuthService.js'
import logo from './Logo.png';
import addSign from './images/AddSign.svg'
import zapisy from './images/Zapisy.svg'
import lekarzSign from './images/LekarzSign.svg'
import person from './images/Person.svg'
import lookup from './images/Lookup.svg'
import logout from './images/Logout.svg';

class Menu extends React.Component {
  constructor(props){
    super(props);
    console.log(this.state.sidebarOpen)
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.onAddClick = this.onAddClick.bind(this);
    this.onVisitsClick = this.onVisitsClick.bind(this);
    this.onProfileClick = this.onProfileClick.bind(this);
  //this.test = this.test.bind(this)
  }
  state = {
    sidebarOpen: true
  }

  onSetSidebarOpen(open) {
    console.log("jestem");
    this.setState({ sidebarOpen: open });
  }

  handleLogout() {
    AuthService.logout();
    this.props.history.push('/');
  }

  onAddClick(event) {
    this.props.history.push('/addVisit');
  }

  onVisitsClick(event) {
    this.props.history.push('/visits');
  }

  onProfileClick(event) {
    this.props.history.push('/myProfile');
  }



  render() {
    return(
<div className = "side-menu-space">
      <Sidebar
      className = "side-menu"
      docked
      transitions
      sidebar = {
        <div className = "side-menu">
          <img src = {logo} className = "imge"/>
          <div className = "icons">
            <div className = "menu-element" onClick={this.onAddClick}>
              <img src = {addSign} className = "addSign" style = {{width: 25}} />
              <a>Dodaj</a>
            </div>
            <div className = "menu-element" onClick={this.onVisitsClick}>
              <img src = {zapisy} className = "addSign" style = {{width: 25}} />
              <a>Wizyty</a>
            </div>
            <div className = "menu-element">
              <img src = {lekarzSign} className = "addSign" style = {{width: 25}} />
              <a>Lekarze</a>
            </div>
            <div className = "menu-element" onClick={this.onProfileClick}>
              <img src = {person} className = "addSign" style = {{width: 25}} />
              <a>Profil</a>
            </div>
            <div className = "menu-element">
              <img src = {lookup} className = "addSign" style = {{width: 25}} />
              <a>Szukaj</a>
            </div>
          </div>
          <div
          className = "menu-element"
          style = {{marginTop: 'auto'}}
          onClick = {this.handleLogout}
          >
            <img src = {logout} className = "addSign" style = {{width: 25}} />
            <a>Wyloguj</a>
          </div>
        </div>
      }
      open = {this.state.sidebarOpen}
      onSetOpen = {this.onSetSidebarOpen}

      children = {<div></div>}
      >
      </Sidebar>
</div>
/*
<div className = "side-menu">
<img src = {logo} className = "imge"/>
<div className = "icons">
<img src = {addSign} className = "addSign" style = {{width: 25}} />

</div>

</div>
*/
    );
  }

}
export default Menu;
