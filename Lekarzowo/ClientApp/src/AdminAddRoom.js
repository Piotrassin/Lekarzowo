import React from 'react';
import AdminService from './services/AdminService.js';
import UserService from './services/UserService.js';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Autocomplete from './components/Autocomplete.js';
import TextField from '@material-ui/core/TextField';

class AdminAddRoom extends React.Component {
constructor(props){
  super(props);
  this.state = {
    room: {
      number: "",
      localId: ""
    },
    loading: false,
    clear: 1
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickAddRoom = this.handleClickAddRoom.bind(this);
  this.onClickLocalSearch = this.onClickLocalSearch.bind(this);
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

onClickLocalSearch(value) {
  this.setState(prevState => ({
    room: {
      ...prevState.room,
      localId: value.id
    }
  }));
}

handleClickAddRoom(event){
  this.setState ({
    errors: Validation.validateAdminAddRoom(this.state.room.localId,
    this.state.room.number)
  }, () => {
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');
    }else {
      AdminService.postRoom(this.state.room)
      .then(response => {
        this.setState({
          room: {
            number: "",
            localId: ""
          },
          clear: this.state.clear + 1
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
      <a className = 'subheader-content-profile'>Dodaj Pokój</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <Autocomplete
            requestCallback = {AdminService.getLocals}
            title = "Lokal"
            changeCallback = {this.onClickLocalSearch}
            dataTestId = 'autocomplete-local'
            key = {this.state.clear}
            />
            <br/>
            <TextField id="number" name="number"
            label="Numer pokoju"
            value = {this.state.room.number}
            onChange = {this.onChangeTextField}
            type = 'number'
            size="small" fullWidth />
          </div>
          <br/><br/>
          <div>
            <a className = 'button-green' onClick = {this.handleClickAddRoom}>Dodaj</a>
          </div>
        </form>
      </div>
      <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminAddRoom;
