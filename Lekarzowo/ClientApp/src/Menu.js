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
import logout from './images/Logout.svg'
import settingsIcon from './images/SettingsIcon.svg';
import mapIcon from './images/MapIcon.svg';

const currentUserRole = AuthService.getUserCurrentRole();
class Menu extends React.Component {
  constructor(props){
    super(props);
    console.log(this.state.sidebarOpen)
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.onAddClick = this.onAddClick.bind(this);
    this.onVisitsClick = this.onVisitsClick.bind(this);
    this.onProfileClick = this.onProfileClick.bind(this);
    this.onDoctorClick = this.onDoctorClick.bind(this);
    this.onAdminPanelClick = this.onAdminPanelClick.bind(this);
    this.onDashboardClick = this.onDashboardClick.bind(this);
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
    this.props.history.push('/login');
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

  onDoctorClick(event) {
    this.props.history.push('/findDoctor');
  }

  onAdminPanelClick(event) {
    this.props.history.push('/adminPanel')
  }

  onDashboardClick(event) {
    if(currentUserRole == 'doctor'){
        this.props.history.push('/dashboardDoctor')
    }else {
        this.props.history.push('/')
    }

  }

  /*<div className = "menu-element">
    <img src = {lookup} className = "addSign" style = {{width: 25}} />
    <a>Szukaj</a>
  </div>*/

  render() {
    return(
<div className = "side-menu-space">
      <Sidebar
      className = "side-menu"
      docked
      transitions
      sidebar = {
        <div className = "side-menu">
          <img src = {logo} className = "imge" style = {{marginTop: '10px'}}/>
          <div className = "icons">
          {(currentUserRole == 'doctor' || currentUserRole == 'patient') ?
          <div className = "menu-element" onClick={this.onDashboardClick}>
            <img src = {mapIcon} className = "addSign" style = {{width: 35}} />
            <a>Główna</a>
          </div>
          :
          <div/>
          }

            {currentUserRole == 'admin' ?
              <div className = "menu-element" onClick={this.onAdminPanelClick}>
                <img src = {settingsIcon} className = "addSign" style = {{width: 30}} />
                <a>Panel</a>
                </div>
                :
                <div/>
            }
            {(currentUserRole == 'patient') ?
            <div className = "menu-element" onClick={this.onAddClick}>
              <img src = {addSign} className = "addSign" style = {{width: 25}} />
              <a>Dodaj</a>
            </div>
            :
            <div/>
            }
            {(currentUserRole == 'doctor' || currentUserRole == 'patient')  ?
            <div className = "menu-element" onClick={this.onVisitsClick}>
              <img src = {zapisy} className = "addSign" style = {{width: 25}} />
              <a>Wizyty</a>
            </div>
            :
            <div/>
            }
            <div className = "menu-element" onClick={this.onDoctorClick}>
              <img src = {lekarzSign} className = "addSign" style = {{width: 25}} />
              <a>Lekarze</a>
            </div>
            <div className = "menu-element" onClick={this.onProfileClick}>
              <img src = {person} className = "addSign" style = {{width: 25}} />
              <a>Profil</a>
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

    );
  }

}
export default Menu;
