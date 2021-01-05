import React from 'react';
import AdminService from './services/AdminService.js';
import UserService from './services/UserService.js';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Autocomplete from './components/Autocomplete.js';
import TextField from '@material-ui/core/TextField';

class AdminAddRole extends React.Component {
constructor(props){
  super(props);
  this.state = {
    roleId: "",
    userId: "",
    userRoles: "",
    loading: false,
    clear1: 1,
    clear2: 2,
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickAddRole = this.handleClickAddRole.bind(this);
  this.onClickUserSearch = this.onClickUserSearch.bind(this);
  this.onClickRoleSearch = this.onClickRoleSearch.bind(this);
}

snackbarRef = React.createRef();

onChangeTextField(event){
  var targetName = event.target.name;
  var targetValue = event.target.value;
  this.setState(prevState => ({
    room: {
      ...prevState.room,
      [targetName]: targetValue
    }
  }));
}

onClickUserSearch(value) {
  this.setState({
    userId: value.id
  });
}

onClickRoleSearch(value) {
  this.setState({
    roleId: value.id
  });
}

handleClickAddRole(event){
  this.setState ({
    errors: Validation.validateUniversalBlankTwoinputsNumber(this.state.roleId,
    this.state.userId, 'Rola', 'Użytkownik')
  }, () => {
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');
    }else {
      AdminService.postUserAddRole(this.state.roleId, this.state.userId)
      .then(response => {
        this.setState({
          roleId: "",
          userId: "",
          clear1: this.state.clear1 - 1,
          clear2: this.state.clear2 + 1
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
      <a className = 'subheader-content-profile'>Przypisywanie ról</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <Autocomplete
            requestCallback = {AdminService.getUsers}
            title = "Użytkownik"
            changeCallback = {this.onClickUserSearch}
            dataTestId = 'autocomplete-local'
            key = {this.state.clear1}
            />
            <br/>
            <Autocomplete
            requestCallback = {AdminService.getRoles}
            title = "Rola"
            changeCallback = {this.onClickRoleSearch}
            dataTestId = 'autocomplete-local'
            key = {this.state.clear2}
            />
            <br/>

          </div>
          <br/><br/>
          <div>
            <a className = 'button-green' onClick = {this.handleClickAddRole}>Dodaj</a>
          </div>
        </form>
      </div>
      <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminAddRole;
