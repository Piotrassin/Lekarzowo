import React from 'react';
import AdminService from './services/AdminService.js';
import UserService from './services/UserService.js';
import VisitService from './services/VisitService.js';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Autocomplete from './components/Autocomplete.js';

class AdminDeleteMedicine extends React.Component {
constructor(props){
  super(props);
  this.state = {
    loading: false,
    selectedObjectId: "",
    clear: false
  };

  this.handleClickDelete = this.handleClickDelete.bind(this);
  this.onClickSearch = this.onClickSearch.bind(this);
}
snackbarRef = React.createRef();



onClickSearch(value) {
  this.setState({
    selectedObjectId: value.id
  });
}

handleClickDelete(event){
  this.setState ({
    errors: Validation.validateUniversalNumberBlank(this.state.selectedObjectId, "Lek")
  }, () => {
    console.log(this.state.errors);
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

    }else {
      AdminService.deleteMedicine(this.state.selectedObjectId)
      .then(response => {
        this.setState({
          clear: !this.state.clear,
          selectedObjectId: ""
        });
        this.snackbarRef.current.openSnackBar('Usunięto', 'green-snackbar');
      })
      .catch(err => {
          try{
            this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
          }catch(erorr){
            console.log('Missed Reference');
          };
      });
    }
  });

}

render() {
  return(
    <div className = 'admin-content-holder flex-column' >
      <a className = 'subheader-content-profile'>Usuń Lek</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
          <Autocomplete
          requestCallback = {VisitService.getAvailableMedicine}
          title = "Lek"
          changeCallback = {this.onClickSearch}
          dataTestId="autocomplete-local"
          key = {this.state.clear}
          />
          </div>
          <br/><br/>
          <div>
            <a className = 'button-red' onClick = {this.handleClickDelete}>Usuń</a>
          </div>
        </form>
      </div>
      <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminDeleteMedicine;
