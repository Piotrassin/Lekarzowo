import React from 'react';
import AdminService from './services/AdminService.js';
import UserService from './services/UserService.js';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Autocomplete from './components/Autocomplete.js';

class AdminDeleteCity extends React.Component {
constructor(props){
  super(props);
  this.state = {
    loading: false,
    selectedCityId: "",
    clear: false
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickDeleteCity = this.handleClickDeleteCity.bind(this);
  this.onClickCitySearch = this.onClickCitySearch.bind(this);
}
snackbarRef = React.createRef();

onChangeTextField(event){
  this.setState({
      [event.target.name]: event.target.value
  });
}

onClickCitySearch(value) {
  this.setState({
    selectedCityId: value.id
  });
}

handleClickDeleteCity(event){
  this.setState ({
    errors: Validation.validateUniversalNumberBlank(this.state.selectedCityId, "Miasto")
  }, () => {
    console.log(this.state.errors);
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

    }else {
      AdminService.deleteCity(this.state.selectedCityId)
      .then(response => {
        this.setState({
          cityName: "",
          clear: !this.state.clear,
          selectedCityId: ""
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
      <a className = 'subheader-content-profile'>Usuń Miasto</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <Autocomplete
            requestCallback = {UserService.getCities}
            title = "Miasto"
            changeCallback = {this.onClickCitySearch}
            dataTestId = 'autocomplete-cities'
            clear = {this.state.clear}
            />
          </div>
          <br/><br/>
          <div>
            <a className = 'button-red' onClick = {this.handleClickDeleteCity}>Usuń</a>
          </div>
        </form>
      </div>
      <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminDeleteCity;
