import React from 'react';
import AdminService from './services/AdminService.js';
import DoctorService from './services/DoctorService.js';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Formater from './helpers/Formater.js';
import Autocomplete from './components/Autocomplete.js';
import TextField from '@material-ui/core/TextField';

class AdminDeleteWorkingHours extends React.Component {
constructor(props){
  super(props);
  this.state = {
    doctorsArray: [],
    dateStart: "",
    dateEnd: "",
    timeStart: "",
    timeEnd: "",
    loading: false,
    doctorSelected: null,
    localSelected: null,
    wFSelected: null,
    clear: 1,
    clear1: 2,
    clear2: 3
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickAddWorkinghours = this.handleClickAddWorkinghours.bind(this);
  this.onClickDoctorSearch = this.onClickDoctorSearch.bind(this);
  this.onClickLocalSearch = this.onClickLocalSearch.bind(this);
  this.onClickWHSearch = this.onClickWHSearch.bind(this);
}

snackbarRef = React.createRef();

onChangeTextField(event){
  this.setState({
      [event.target.name]: event.target.value
  });
}

onClickDoctorSearch(value) {
  this.setState({
    doctorSelected: value.id
  });
}

onClickLocalSearch(value) {
  this.setState({
    localSelected: value.id
  });
}

onClickWHSearch(value) {
  this.setState({
    wFSelected: value.id
  });
}


handleClickAddWorkinghours(event){
  this.setState ({
    errors: Validation.validateAdminDeleteWorkingHours(this.state.doctorSelected, this.state.localSelected,
    this.state.wFSelected)
  }, () => {
    console.log(this.state.errors);
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');
    }else {
      AdminService.deleteWorkinghours(this.state.wFSelected)
      .then(response => {
        this.setState({
          doctorSelected: null,
          localSelected: null,
          wFSelected: null,
          clear: this.state.clear -1,
          clear1: this.state.clear1 + 1000,
          clear2: this.state.clear2 + 2
        });
        this.snackbarRef.current.openSnackBar('Usunięto godziny pracy', 'green-snackbar');
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
      <a className = 'subheader-content-profile'>Usuń godziny pracy</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <Autocomplete
            requestCallback = {DoctorService.getDoctors}
            title = "Doktor"
            changeCallback = {this.onClickDoctorSearch}
            dataTestId = 'autocomplete-doctor'
            key = {this.state.clear}
            />
            <br/>
            {this.state.doctorSelected == undefined ?
              <div/>
              :
            <Autocomplete
            requestCallback = {AdminService.getLocalsByDoctorId}
            title = "Lokal"
            dataTestId  = 'autocomplete-local'
            changeCallback = {this.onClickLocalSearch}
            key = {this.state.clear1}
            addId = {
              this.state.doctorSelected == undefined  ? -1 : this.state.doctorSelected
            }
            />
          }
            <br/>
            {(this.state.doctorSelected == undefined || this.state.localSelected == undefined) ?
              <div/>
              :

            <Autocomplete
            requestCallback = {AdminService.getWorkinghours}
            title = "Godziny pracy"
            dataTestId  = 'autocomplete-local'
            changeCallback = {this.onClickWHSearch}
            key = {this.state.clear2}
            addId = {
              (this.state.doctorSelected == undefined || this.state.localSelected == undefined) ? {doctorId: -1, localId: -1} : {doctorId: this.state.doctorSelected, localId: this.state.localSelected}
            }
            />
          }

          </div>

          <br/><br/>
          <div>
          <a className = 'button-red' onClick = {this.handleClickAddWorkinghours}>Usuń</a>
          </div>
          </form>
          </div>
        <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminDeleteWorkingHours;
