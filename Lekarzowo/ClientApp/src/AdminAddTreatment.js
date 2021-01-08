import React from 'react';
import AdminService from './services/AdminService.js';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Autocomplete from './components/Autocomplete.js';
import TextField from '@material-ui/core/TextField';

class AdminAddTreatment extends React.Component {
constructor(props){
  super(props);
  this.state = {
    treatmentName: "",
    treatmentPrice: "",
    loading: false
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickAddTreatment = this.handleClickAddTreatment.bind(this);
}

snackbarRef = React.createRef();

onChangeTextField(event){
  this.setState({
      [event.target.name]: event.target.value
  });
}

handleClickAddTreatment(event){
  this.setState ({
    errors: Validation.validateUniversalBlankTwoinputs(this.state.treatmentName, this.state.treatmentPrice, "Pole Nazwa zabiegu", "Pole Cena zabiegu")
  }, () => {
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');
    }else {
      AdminService.postTreatment(this.state.treatmentName, this.state.treatmentPrice)
      .then(response => {
        this.setState({
          treatmentName: "",
          treatmentPrice: ""
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
      <a className = 'subheader-content-profile'>Dodaj Zabieg</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <TextField id="treatmentName" name="treatmentName"
            label="Nazwa zabiegu"
            value = {this.state.treatmentName}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
            <br/>
            <TextField id="treatmentPrice" name="treatmentPrice"
            label="Cena zabiegu"
            value = {this.state.treatmentPrice}
            onChange = {this.onChangeTextField}
            type = 'number'
            size="small" fullWidth />
          </div>
          <br/><br/>
          <div>
            <a className = 'button-green' onClick = {this.handleClickAddTreatment}>Dodaj</a>
          </div>
        </form>
      </div>
      <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminAddTreatment;
