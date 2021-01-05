import React from 'react';
import AdminService from './services/AdminService.js';
import UserService from './services/UserService.js';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Autocomplete from './components/Autocomplete.js';

class AdminEditDoctor extends React.Component {
constructor(props){
  super(props);
  this.state = {
    cityName: "",
    loading: false,
    selectedDoctorId: "",
    clear: false
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickEdit = this.handleClickEdit.bind(this);
  this.onClickDoctorSearch = this.onClickDoctorSearch.bind(this);
}
snackbarRef = React.createRef();

onChangeTextField(event){
  this.setState({
      [event.target.name]: event.target.value
  });
}

onClickDoctorSearch(value) {
  console.log(value);
  this.setState({
    selectedDoctorId: value.id
  }, () => {
    AdminService.getDoctor(this.state.selectedDoctorId)
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err.message);
    })
  });

}

handleClickEdit(event){
  this.setState ({
    errors: Validation.validateUniversalBlank(this.state.cityName, "Pole Nazw miasta")
  }, () => {
    console.log(this.state.errors);
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

    }else {
      AdminService.putDoctor(this.state.selectedCityId, this.state.cityName)
      .then(response => {
        console.log(response);
        this.setState({
          cityName: "",
          clear: !this.state.clear,
          selectedCityId: ""
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
      <a className = 'subheader-content-profile'>Edytuj lekarza</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <Autocomplete
            requestCallback = {UserService.getDoctors}
            title = "Doktor"
            changeCallback = {this.onClickDoctorSearch}
            dataTestId="autocomplete-doctor"
            clear = {this.state.clear}
            />
            <br/>
            <Autocomplete
            requestCallback = {UserService.getSpecializations}
            title = "Specjalizacja"
            changeCallback = {this.onClickSpecializationSearch}
            noOptionsText={'Your Customized No Options Text'}
            />
            <br/>
            <TextField id="name" name="name"
            label="Imię"
            value = {this.state.name}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
            <br/>
            <TextField id="lastname" name="lastname"
            label="Nazwisko"
            value = {this.state.lastname}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
            <br/>
            <TextField id="birthdate" name="birthdate"
            label="Data urodzenia"
            value = {this.state.birthdate}
            onChange = {this.onChangeTextField}
            type = 'date'
            size="small" fullWidth />
            <br/>
            <TextField id="email" name="email"
            label="Email"
            value = {this.state.email}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
            <br/>
            <TextField id="password" name="password"
            label="Hasło"
            value = {this.state.password}
            onChange = {this.onChangeTextField}
            type = 'password'
            size="small" fullWidth />
            <br/>
            <TextField id="gender" name="gender"
            label="Płeć"
            value = {this.state.gender}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
            <br/>
            <TextField id="pesel" name="pesel"
            label="PESEL"
            value = {this.state.pesel}
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
export default AdminEditDoctor;
