import React from 'react';
import SicknessItem from './components/SicknessItem.js';
import AdminService from './services/AdminService.js';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from './helpers/Snackbar.js';
import Autocomplete from './components/Autocomplete.js';
import Validation from './helpers/Validation.js';

class AdminAddSickness extends React.Component {
constructor(props){
  super(props);
  this.state = {
    illnessName: "",
    loading: false
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickAddIllness = this.handleClickAddIllness.bind(this);
}

snackbarRef = React.createRef();

onChangeTextField(event){
  this.setState({
      [event.target.name]: event.target.value
  });
}

handleClickAddIllness(event){
  this.setState ({
    errors: Validation.validateUniversalBlank(this.state.illnessName, "Pole Nazwa choroby")
  }, () => {
    console.log(this.state.errors);
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

    }else {
      AdminService.postIllness(this.state.illnessName)
      .then(response => {
        console.log(response);
        this.setState({
          illnessName: ""
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

componentDidMount() {

}

render() {
  return(
    <div className = 'admin-content-holder flex-column' >
      <a className = 'subheader-content-profile'>Dodaj Chorobę</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <TextField id="illnessName" name="illnessName"
            label="Nazwa choroby"
            value = {this.state.illnessName}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
          </div>

          <br/><br/>
          <div>
          <a className = 'button-green' onClick = {this.handleClickAddIllness}>Dodaj</a>
          </div>
          </form>
          </div>
        <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminAddSickness;
