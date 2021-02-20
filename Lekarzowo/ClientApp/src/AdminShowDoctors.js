import React from 'react';
import AdminService from './services/AdminService.js';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';

class AdminShowDoctors extends React.Component {
constructor(props){
  super(props);
  this.state = {
    list: [],
    loading: false
  };

}
snackbarRef = React.createRef();

componentDidMount() {
  this.showList();
}

showList() {
  this.setState({
    loading: true
  });
  AdminService.getAllDoctors()
  .then(response => {
    this.setState({
      list: response,
      loading: false
    });
  })
  .catch(err => {
    console.log(err.message);
    this.setState({
      loading: false
    });
  })
}

render() {
  return(
    <div className = 'admin-content-holder flex-column' >
      <a className = 'subheader-content-profile'>Lista Doktorów</a>
      <div className = 'flex-column width-100'>
        <div className = 'flex-column width-100'>
          <div className = 'sickness-item'>
            <div className = 'sickness-item-part part-1'>
              <a className = 'table-header'>Imię</a>
            </div>
            <div className = 'sickness-item-part part-2'>
              <a className = 'table-header'>Nazwisko</a>
            </div>
            <div className = 'sickness-item-part part-3'>
              <a className = 'table-header'>Email</a>
            </div>
            <div className = 'sickness-item-part part-4-5'>
              <a className = 'table-header'>Specjalizacja</a>
            </div>
          </div>
          {this.state.loading == true ?
            <div className = 'sickness-item'>
              <div className = 'sickness-item-part part-1-2-3-4-5'>
                <a className = 'table-header'>Pobieranie...</a>
              </div>
            </div>
            :
            <div/>
          }
          {this.state.list.length > 0 && this.state.list.map((object, index ) => (
            <div className = 'sickness-item'>
              <div className = 'sickness-item-part part-1'>
                <a>{object.person.name}</a>
              </div>
              <div className = 'sickness-item-part part-2'>
                <a>{object.person.lastname}</a>
              </div>
              <div className = 'sickness-item-part part-3'>
                <a>{object.person.email}</a>
              </div>
              <div className = 'sickness-item-part part-4-5'>
                <a>{object.speciality.name}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminShowDoctors;
