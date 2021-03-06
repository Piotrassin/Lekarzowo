import React from 'react';
import AdminService from './services/AdminService.js';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import TextField from '@material-ui/core/TextField';

class AdminAddMedicine extends React.Component {
constructor(props){
  super(props);
  this.state = {
    medicineName: "",
    loading: false
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickAddMedicine = this.handleClickAddMedicine.bind(this);
}

snackbarRef = React.createRef();

onChangeTextField(event){
  this.setState({
      [event.target.name]: event.target.value
  });
}

handleClickAddMedicine(event){
  this.setState ({
    errors: Validation.validateUniversalBlank(this.state.medicineName, "Pole Nazwa leku")
  }, () => {
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');
    }else {
      AdminService.postMedicine(this.state.medicineName)
      .then(response => {
        this.setState({
          medicineName: ""
        });
        this.snackbarRef.current.openSnackBar('Zaktualizowano Dane', 'green-snackbar');
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
      <a className = 'subheader-content-profile'>Dodaj Lek</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <TextField id="medicineName" name="medicineName"
            label="Nazwa leku"
            value = {this.state.medicineName}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
          </div>
          <br/><br/>
          <div>
            <a className = 'button-green' onClick = {this.handleClickAddMedicine}>Dodaj</a>
          </div>
        </form>
      </div>
      <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminAddMedicine;
