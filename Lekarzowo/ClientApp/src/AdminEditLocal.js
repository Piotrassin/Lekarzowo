import React from 'react';
import AdminService from './services/AdminService.js';
import UserService from './services/UserService.js';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Autocomplete from './components/Autocomplete.js';

class AdminEditLocal extends React.Component {
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
    loading: false,
    selectedObjectId: "",
    selectedCustomValue: null,
    clear1: 1,
    clear2: 2
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickEdit = this.handleClickEdit.bind(this);
  this.onClickSearch = this.onClickSearch.bind(this);
  this.onClickCitySearch = this.onClickCitySearch.bind(this);
}
snackbarRef = React.createRef();


onClickSearch(value) {
  console.log(value);
  this.setState({
    selectedObjectId: value.id
  }, () => {
    AdminService.getLocal(this.state.selectedObjectId)
    .then(response => {
      console.log(response);
      this.setState(prevState => ({
        ...prevState,
        local: {
          name: response.name,
          cityId: response.cityId,
          streetName: response.streetname,
          postCode: response.postcode,
          streetNumber: response.streetnumber,
          blockNumber: response.blocknumber
        },
        selectedCustomValue: {
          id: response.city.id,
          name: response.city.name
        },
        clear2: prevState.clear2 + 1
      }));
    })
    .catch(err => {
      console.log(err.message);
    })
  });

}

onClickCitySearch(value) {
  this.setState(prevState => ({
    ...prevState,
    local: {
      ...prevState.local,
      cityId: value.id
    },
    selectedCustomValue: null
  }));
}

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

handleClickEdit(event){
  this.setState ({
    errors: Validation.validateBlankLocal(this.state.local)
  }, () => {
    console.log(this.state.errors);
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

    }else {
      AdminService.putLocal(this.state.selectedObjectId, this.state.local)
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
          },
          clear1: this.state.clear1 - 1,
          clear2: this.state.clear2 + 2,
          selectedObjectId: "",
          selectedCustomValue: null
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
      <a className = 'subheader-content-profile'>Edytuj lokal</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <Autocomplete
            requestCallback = {AdminService.getLocals}
            title = "Lokal"
            changeCallback = {this.onClickSearch}
            dataTestId="autocomplete-local"
            key = {this.state.clear1}
            />
            <br/>
            <Autocomplete
            requestCallback = {UserService.getCities}
            title = "Miasto"
            changeCallback = {this.onClickCitySearch}
            dataTestId = 'autocomplete-cities'
            selectedCustomValue = {this.state.selectedCustomValue}
            key = {this.state.clear2}
            clear = {this.state.selectedCustomValue}
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
            <a className = 'button-green' onClick = {this.handleClickEdit}>Edytuj</a>
          </div>
        </form>
      </div>
      <Snackbar ref = {this.snackbarRef} />
    </div>
  );
}

}
export default AdminEditLocal;
