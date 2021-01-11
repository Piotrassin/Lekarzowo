import React from 'react';
import AdminService from './services/AdminService.js';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Autocomplete from './components/Autocomplete.js';
import TextField from '@material-ui/core/TextField';

class AdminAddSpeciality extends React.Component {
constructor(props){
  super(props);
  this.state = {
    speciality: {
      name: "",
      price: "",
      duration: ""
    },
    loading: false
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickAddSpeciality = this.handleClickAddSpeciality.bind(this);
}

snackbarRef = React.createRef();

onChangeTextField(event){
  var targetName = event.target.name;
  var targetValue = event.target.value;
  this.setState(prevState => ({
    speciality: {
      ...prevState.speciality,
      [targetName]: targetValue
    }
  }));
}

handleClickAddSpeciality(event){
  this.setState ({
    errors: Validation.validateAdminAddSeciality(this.state.speciality.name,
    this.state.speciality.price, this.state.speciality.duration)
  }, () => {
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');
    }else {
      AdminService.postSpeciality(this.state.speciality)
      .then(response => {
        this.setState({
          speciality: {
            name: "",
            price: "",
            duration: ""
          }
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
      <a className = 'subheader-content-profile'>Dodaj Specializację</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <TextField id="name" name="name"
            label="Nazwa specializacji"
            value = {this.state.speciality.name}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
            <br/>
            <TextField id="price" name="price"
            label="Cena bazowa za wizytę"
            value = {this.state.speciality.price}
            onChange = {this.onChangeTextField}
            type = 'number'
            size="small" fullWidth />
            <br/>
            <TextField id="duration" name="duration"
            label="Docelowy czas wizyty"
            value = {this.state.speciality.duration}
            onChange = {this.onChangeTextField}
            type = 'number'
            size="small" fullWidth />
          </div>
          <br/><br/>
          <div>
            <a className = 'button-green' onClick = {this.handleClickAddSpeciality}>Dodaj</a>
          </div>
        </form>
      </div>
      <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminAddSpeciality;
