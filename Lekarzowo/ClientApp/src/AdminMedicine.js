import React from 'react';
import AdminService from './services/AdminService.js';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import AdminAddMedicine from './AdminAddMedicine.js';
import AdminEditMedicine from './AdminEditMedicine.js';
import AdminDeleteMedicine from './AdminDeleteMedicine.js';
import AdminShowMedicine from './AdminShowMedicine.js';

class AdminMedicine extends React.Component {
constructor(props){
  super(props);
  this.state = {
    currentPage:  "add"
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
    case 'add':
      return <AdminAddMedicine />
      break;
    case 'edit':
      return <AdminEditMedicine />
      break;
    case 'delete':
      return <AdminDeleteMedicine />
      break;
    case 'show':
      return <AdminShowMedicine />
      break;

  }
}





render() {
  return(
    <div className = 'admin-content-holder flex-column' >
      <div className = 'admin-btn-container'>
        <button className = {this.state.currentPage == 'add' ?
        'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
        name = 'add' onClick = {this.handleClickBtn}>
        Dodaj
        </button>
        <button className = {this.state.currentPage == 'edit' ?
        'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
        name = 'edit' onClick = {this.handleClickBtn}>
        Edytuj
        </button>
        <button className = {this.state.currentPage == 'delete' ?
        'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
        name = 'delete' onClick = {this.handleClickBtn}>
        Usuń
        </button>
        <button className = {this.state.currentPage == 'show' ?
        'btn-primary margin-right-small' : 'btn-primary-outlined margin-right-small'}
        name = 'show' onClick = {this.handleClickBtn}>
        Lista
        </button>
      </div>
      {this.showContent()}
    </div>
  );
}

}
export default AdminMedicine;
