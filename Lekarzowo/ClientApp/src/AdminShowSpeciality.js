import React from 'react';
import AdminService from './services/AdminService.js';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';

class AdminShowSpeciality extends React.Component {
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
  AdminService.getAllSpecializations()
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
      <a className = 'subheader-content-profile'>Lista Specjalizacji</a>
      <div className = 'flex-column width-100'>
        <div className = 'flex-column width-100'>
          <div className = 'sickness-item'>
            <div className = 'sickness-item-part part-1-2-3'>
              <a className = 'table-header'>Specjalizacja</a>
            </div>
            <div className = 'sickness-item-part part-4-5'>
              <a className = 'table-header'>Cena</a>
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
          {this.state.list && this.state.list.map((object, index ) => (
            <div className = 'sickness-item'>
            <div className = 'sickness-item-part part-1-2-3'>
              <a>{object.name}</a>
            </div>
            <div className = 'sickness-item-part part-4-5'>
              <a>{object.price}</a>
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
export default AdminShowSpeciality;
