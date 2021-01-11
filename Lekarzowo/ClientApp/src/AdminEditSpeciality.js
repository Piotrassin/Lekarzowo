import React from 'react';
import AdminService from './services/AdminService.js';
import UserService from './services/UserService.js';
import VisitService from './services/VisitService.js';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Autocomplete from './components/Autocomplete.js';

class AdminEditSpeciality extends React.Component {
constructor(props){
  super(props);
  this.state = {
    specialityName: "",
    specialityPrice: "",
    specialityDuration: "",
    loading: false,
    selectedObjectId: "",
    clear: false
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickEdit = this.handleClickEdit.bind(this);
  this.onClickSearch = this.onClickSearch.bind(this);
}
snackbarRef = React.createRef();

onChangeTextField(event){
  this.setState({
      [event.target.name]: event.target.value
  });
}

onClickSearch(value) {
  console.log(value);
  this.setState({
    selectedObjectId: value.id
  }, () => {
    AdminService.getSpeciality(value.id)
    .then(response => {
      this.setState({
        specialityName: response.name,
        specialityPrice: response.price,
        specialityDuration: response.durationOfVisit
      })
    })
    .catch(err => {
        try{
          this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
        }catch(erorr){
          console.log('Missed Reference');
        };
    });
  });

}

handleClickEdit(event){
  this.setState ({
    errors: Validation.validateUniversalBlank(this.state.specialityName, "Specjalizacja")
  }, () => {
    console.log(this.state.errors);
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

    }else {
      AdminService.putSpeciality(this.state.selectedObjectId, this.state.specialityName, this.state.specialityPrice, this.state.specialityDuration)
      .then(response => {
        console.log(response);
        this.setState({
          specialityPrice: "",
          specialityName: "",
          specialityDuration: "",
          clear: !this.state.clear,
          selectedObjectId: ""
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
      <a className = 'subheader-content-profile'>Edytuj specjalizację</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <Autocomplete
            requestCallback = {UserService.getSpecializations}
            title = "Specjalizacja"
            changeCallback = {this.onClickSearch}
            dataTestId="autocomplete-local"
            key = {this.state.clear}
            />
            <br/>
            <TextField id="specialityName" name="specialityName"
            label="Nazwa specializacji"
            value = {this.state.specialityName}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
            <br/>
            <TextField id="specialityPrice" name="specialityPrice"
            label="Cena bazowa za wizytę"
            value = {this.state.specialityPrice}
            onChange = {this.onChangeTextField}
            type = 'number'
            size="small" fullWidth />
            <br/>
            <TextField id="specialityDuration" name="specialityDuration"
            label="Docelowy czas wizyty"
            value = {this.state.specialityDuration}
            onChange = {this.onChangeTextField}
            type = 'number'
            size="small" fullWidth />
          </div>
          <br/><br/>
          <div>
            <a className = 'button-green' onClick = {this.handleClickEdit}>Edytuj</a>
          </div>
        </form>
      </div>
      <Snackbar ref = {this.snackbarRef} />
    </div>
  );
}

}
export default AdminEditSpeciality;
