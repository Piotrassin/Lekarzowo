import React from 'react';
import AdminService from './services/AdminService.js';
import UserService from './services/UserService.js';
import VisitService from './services/VisitService.js';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Autocomplete from './components/Autocomplete.js';

class AdminEditTreatment extends React.Component {
constructor(props){
  super(props);
  this.state = {
    treatmentName: "",
    treatmentPrice: "",
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
    selectedObjectId: value.id,
    treatmentName: value.name,
    treatmentPrice: value.price
  });

}

handleClickEdit(event){
  this.setState ({
    errors: Validation.validateUniversalBlankTwoinputs(this.state.treatmentName, this.state.treatmentPrice.toString(), "Pole Nazwa zabiegu", "Pole Cena zabiegu")
  }, () => {
    console.log(this.state.errors);
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

    }else {
      AdminService.putTreatment(this.state.selectedObjectId, this.state.treatmentName, this.state.treatmentPrice)
      .then(response => {
        console.log(response);
        this.setState({
          treatmentName: "",
          treatmentPrice: "",
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
      <a className = 'subheader-content-profile'>Edytuj zabieg</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <Autocomplete
            requestCallback = {VisitService.getAvailableTreatments}
            title = "Zabieg"
            changeCallback = {this.onClickSearch}
            dataTestId="autocomplete-treatment"
            key = {this.state.clear}
            />
            <br/>
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
            <a className = 'button-green' onClick = {this.handleClickEdit}>Edytuj</a>
          </div>
        </form>
      </div>
      <Snackbar ref = {this.snackbarRef} />
    </div>
  );
}

}
export default AdminEditTreatment;
