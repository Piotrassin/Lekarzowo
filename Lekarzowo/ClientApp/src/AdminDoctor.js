import React from 'react';
import AdminService from './services/AdminService.js';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import AdminAddDoctor from './AdminAddDoctor.js';
import AdminEditDoctor from './AdminEditDoctor.js';
import AdminDeleteDoctor from './AdminDeleteDoctor.js';
import AdminShowDoctors from './AdminShowDoctors.js';

class AdminDoctor extends React.Component {
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
      return <AdminAddDoctor />
      break;
    case 'edit':
      return <AdminEditDoctor />
      break;
    case 'delete':
      return <AdminDeleteDoctor />
      break;
    case 'show':
      return <AdminShowDoctors />
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
      <div className = 'overflow-y-auto' style = {{height: '80%'}}>
      {this.showContent()}
      </div>
    </div>
  );
}

}
export default AdminDoctor;
