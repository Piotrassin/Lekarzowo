import React from 'react';
import Menu from './Menu.js';
import AdminAddMedicine from './AdminAddMedicine.js';
import AdminAddSickness from './AdminAddSickness.js';
import AdminCity from './AdminCity.js';
import AdminAddWorkingHours from './AdminAddWorkingHours.js';
import AdminAddLocal from './AdminAddLocal.js';
import AdminAddRoom from './AdminAddRoom.js';
import AdminAddTreatment from './AdminAddTreatment.js';
import AdminAddSpeciality from './AdminAddSpeciality.js';
import AdminAddDoctor from './AdminAddDoctor.js';
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
        return <AdminAddMedicine />
        break;
      case 'addSickness':
        return <AdminAddSickness />
        break;
      case 'addWorkingHours':
        return <AdminAddWorkingHours />
        break;
      case 'addCity':
        return <AdminCity />
        break;
      case 'addLocal':
        return <AdminAddLocal />
        break;
      case 'addRoom':
        return <AdminAddRoom />
        break;
      case 'addTreatment':
        return <AdminAddTreatment />
        break;
      case 'addSpeciality':
        return <AdminAddSpeciality />
        break;
      case 'addDoctor':
        return <AdminAddDoctor />
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
                Dodaj lekarza
                </button>
                <button className = {this.state.currentPage == 'addSickness' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addSickness' onClick = {this.handleClickBtn}>
                Dodaj chorobę
                </button>
                <button className = {this.state.currentPage == 'addMedicine' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addMedicine' onClick = {this.handleClickBtn}>
                Dodaj lek
                </button>
                <button className = {this.state.currentPage == 'addWorkingHours' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addWorkingHours' onClick = {this.handleClickBtn}>
                Dodaj godziny pracy
                </button>
              </div>
              <div className = 'admin-btn-container'>
                <button className = {this.state.currentPage == 'addCity' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addCity' onClick = {this.handleClickBtn}>
                Wprowadź miasto
                </button>
                <button className = {this.state.currentPage == 'addLocal' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addLocal' onClick = {this.handleClickBtn}>
                Wprowadź lokal
                </button>
                <button className = {this.state.currentPage == 'addRoom' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addRoom' onClick = {this.handleClickBtn} >
                Wprowadź pokój
                </button>
                <button className = {this.state.currentPage == 'addTreatment' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addTreatment' onClick = {this.handleClickBtn}>
                Dodaj zabieg
                </button>
                <button className = {this.state.currentPage == 'addSpeciality' ?
                'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
                name = 'addSpeciality' onClick = {this.handleClickBtn}>
                Dodaj specjalizację
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
