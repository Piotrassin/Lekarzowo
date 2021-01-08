import React from 'react';
import AdminService from './services/AdminService.js';
import UserService from './services/UserService.js';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Autocomplete from './components/Autocomplete.js';

class AdminEditCity extends React.Component {
constructor(props){
  super(props);
  this.state = {
    cityName: "",
    loading: false,
    selectedCityId: "",
    clear: false
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickEditCity = this.handleClickEditCity.bind(this);
  this.onClickCitySearch = this.onClickCitySearch.bind(this);
}
snackbarRef = React.createRef();

onChangeTextField(event){
  this.setState({
      [event.target.name]: event.target.value
  });
}

onClickCitySearch(value) {
  console.log(value);
  this.setState({
    selectedCityId: value.id,
    cityName: value.name
  });
}

handleClickEditCity(event){
  this.setState ({
    errors: Validation.validateUniversalBlank(this.state.cityName, "Pole Nazw miasta")
  }, () => {
    console.log(this.state.errors);
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

    }else {
      AdminService.putCity(this.state.selectedCityId, this.state.cityName)
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
      <a className = 'subheader-content-profile'>Edytuj Miasto</a>
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
            <br/>
            <TextField id="cityName" name="cityName"
            label="Nazwa miasta"
            value = {this.state.cityName}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
          </div>
          <br/><br/>
          <div>
            <a className = 'button-green' onClick = {this.handleClickEditCity}>Edytuj</a>
          </div>
        </form>
      </div>
      <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminEditCity;
