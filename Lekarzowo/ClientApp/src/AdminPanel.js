import React from 'react';
import Menu from './Menu.js';
import AdminMedicine from './AdminMedicine.js';
import AdminSickness from './AdminSickness.js';
import AdminCity from './AdminCity.js';
import AdminWorkinghours from './AdminWorkinghours.js';
import AdminLocal from './AdminLocal.js';
import AdminRoom from './AdminRoom.js';
import AdminTreatment from './AdminTreatment.js';
import AdminSpeciality from './AdminSpeciality.js';
import AdminDoctor from './AdminDoctor.js';
import AdminRoles from './AdminRoles.js';
import RoleButton from './components/RoleButton.js';

class AdminPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentPage:  "addDoctor"
    };
    this.handleClickBtn = this.handleClickBtn.bind(this);
    this.showContent = this.showContent.bind(this);
  }

  handleClickBtn(event){
    this.setState({
      currentPage: event.target.name
    });
  }

  showContent(){
    switch(this.state.currentPage){
      case 'addMedicine':
        return <AdminMedicine />
        break;
      case 'addSickness':
        return <AdminSickness />
        break;
      case 'addWorkingHours':
        return <AdminWorkinghours />
        break;
      case 'addCity':
        return <AdminCity />
        break;
      case 'addLocal':
        return <AdminLocal />
        break;
      case 'addRoom':
        return <AdminRoom />
        break;
      case 'addTreatment':
        return <AdminTreatment />
        break;
      case 'addSpeciality':
        return <AdminSpeciality />
        break;
      case 'addDoctor':
        return <AdminDoctor />
        break;
      case 'addRoles':
        return <AdminRoles />
        break;
    }
  }

  render() {
      return(
        <div className = 'container'>
        <Menu history= {this.props.history}/>
          <div className = 'doctor-find-container flex-column'>
            <div className = 'doctor-cart-header flex-column'>
              <div className = 'flex-row justify-content-space'>
                <a className = 'subheader-content-profile'>Panel Admina</a>
                <RoleButton history= {this.props.history}/>
              </div>
              <div className = 'admin-btn-container'>
                <button className = {this.state.currentPage == 'addDoctor' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addDoctor' onClick = {this.handleClickBtn}>
                Lekarze
                </button>
                <button className = {this.state.currentPage == 'addSickness' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addSickness' onClick = {this.handleClickBtn}>
                Choroby
                </button>
                <button className = {this.state.currentPage == 'addMedicine' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addMedicine' onClick = {this.handleClickBtn}>
                Leki
                </button>
                <button className = {this.state.currentPage == 'addWorkingHours' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addWorkingHours' onClick = {this.handleClickBtn}>
                Godziny pracy
                </button>
                <button className = {this.state.currentPage == 'addRoles' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addRoles' onClick = {this.handleClickBtn}>
                Role
                </button>
              </div>
              <div className = 'admin-btn-container'>
                <button className = {this.state.currentPage == 'addCity' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addCity' onClick = {this.handleClickBtn}>
                Miasta
                </button>
                <button className = {this.state.currentPage == 'addLocal' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addLocal' onClick = {this.handleClickBtn}>
                Lokale
                </button>
                <button className = {this.state.currentPage == 'addRoom' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addRoom' onClick = {this.handleClickBtn} >
                Pokoje
                </button>
                <button className = {this.state.currentPage == 'addTreatment' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addTreatment' onClick = {this.handleClickBtn}>
                Zabiegi
                </button>
                <button className = {this.state.currentPage == 'addSpeciality' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addSpeciality' onClick = {this.handleClickBtn}>
                Specjalizacje
                </button>
              </div>
            </div>
            {this.showContent()}
          </div>
        </div>
      );
  }
}

export default AdminPanel;
