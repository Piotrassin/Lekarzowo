import React from 'react';
import SicknessItem from './components/SicknessItem.js';
import AdminService from './services/AdminService.js';
import UserService from './services/UserService.js';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from './helpers/Snackbar.js';
import Autocomplete from './components/Autocomplete.js';
import Validation from './helpers/Validation.js';

class AdminAddLocal extends React.Component {
constructor(props){
  super(props);
  this.state = {
    local: {
      name: "",
      cityId: "",
      streetName: "",
      postCode: "",
      streetNumber: "",
      blockNumber: ""
    },

    loading: false
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickAddCity = this.handleClickAddCity.bind(this);
  this.onClickCitySearch = this.onClickCitySearch.bind(this);
}

snackbarRef = React.createRef();

onChangeTextField(event){
  var targetName = event.target.name;
  var targetValue = event.target.value;
  this.setState(prevState => ({
    local: {
      ...prevState.local,
      [targetName]: targetValue
    }
  }));
}

onClickCitySearch(value) {
  this.setState(prevState => ({
    local: {
      ...prevState.local,
      cityId: value.id
    }
  }));
  console.log(value.id);
}

handleClickAddCity(event){
  this.setState ({
    errors: Validation.validateAdminAddLocal(this.state.local.cityId, this.state.local.name,
    this.state.local.streetName, this.state.local.postCode, this.state.local.streetNumber,
    this.state.local.blockNumber)
  }, () => {
    console.log(this.state.errors);
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

    }else {
      AdminService.postLocal(this.state.local)
      .then(response => {
        console.log(response);
        this.setState({
          local: {
            name: "",
            cityId: "",
            streetName: "",
            postCode: "",
            streetNumber: "",
            blockNumber: ""
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

componentDidMount() {

}

render() {
  return(
    <div className = 'admin-content-holder flex-column' >
      <a className = 'subheader-content-profile'>Dodaj Placówkę medyczną</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <Autocomplete
            requestCallback = {UserService.getCities}
            title = "Miasto"
            changeCallback = {this.onClickCitySearch}
            />
            <br/>
            <TextField id="name" name="name"
            label="Nazwa"
            value = {this.state.local.name}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
            <br/>
            <TextField id="streetName" name="streetName"
            label="Ulica"
            value = {this.state.local.streetName}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
            <br/>
            <TextField id="postCode" name="postCode"
            label="Kod pocztowy"
            value = {this.state.local.postCode}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
            <br/>
            <TextField id="streetNumber" name="streetNumber"
            label="Numer"
            value = {this.state.local.streetNumber}
            onChange = {this.onChangeTextField}
            type = 'number'
            size="small" fullWidth />
            <br/>
            <TextField id="blockNumber" name="blockNumber"
            label="Numer bloku"
            value = {this.state.local.blockNumber}
            onChange = {this.onChangeTextField}
            type = 'number'
            size="small" fullWidth />

          </div>

          <br/><br/>
          <div>
          <a className = 'button-green' onClick = {this.handleClickAddCity}>Dodaj</a>
          </div>
          </form>
          </div>
        <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminAddLocal;
