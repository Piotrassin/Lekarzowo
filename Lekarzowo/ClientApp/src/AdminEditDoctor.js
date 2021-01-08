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
    selectedSpecializationId: "",
    clear1: 1,
    clear2: 2,
    selectedCustomValue: null
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickEdit = this.handleClickEdit.bind(this);
  this.onClickDoctorSearch = this.onClickDoctorSearch.bind(this);
  this.onClickSpecializationSearch = this.onClickSpecializationSearch.bind(this);
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
      this.setState({
        selectedCustomValue: {
          id: response.speciality.id,
          name: response.speciality.name
        },
        selectedSpecializationId: response.speciality.id,
        clear2: this.state.clear2 + 1
      });
    })
    .catch(err => {
      console.log(err.message);
    })
  });

}

onClickSpecializationSearch(value) {
  console.log(value);
  this.setState({
    selectedSpecializationId: value.id,
    selectedCustomValue: null
  });

}

handleClickEdit(event){
  this.setState ({
    errors: Validation.validateUniversalBlankTwoinputsNumber(this.state.selectedDoctorId, this.state.selectedSpecializationId , "Pole Doktor", "Pole Specjalizacja")
  }, () => {
    console.log(this.state.errors);
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

    }else {
      AdminService.putDoctor(this.state.selectedDoctorId, this.state.selectedSpecializationId)
      .then(response => {
        console.log(response);
        this.setState({
          cityName: "",
          clear1: this.state.clear1  - 1,
          clear2: this.state.clear2 + 1,
          selectedCityId: "",
          selectedCustomValue: null,
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
      <a className = 'subheader-content-profile'>Edytuj specjalizację lekarza</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <Autocomplete
            requestCallback = {UserService.getDoctors}
            title = "Doktor"
            changeCallback = {this.onClickDoctorSearch}
            dataTestId="autocomplete-doctor"
            key = {this.state.clear1}
            />
            <br/>
            <Autocomplete
            requestCallback = {UserService.getSpecializations}
            title = "Specjalizacja"
            changeCallback = {this.onClickSpecializationSearch}
            selectedCustomValue = {this.state.selectedCustomValue}
            key = {this.state.clear2}

            />
            <br/>
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
