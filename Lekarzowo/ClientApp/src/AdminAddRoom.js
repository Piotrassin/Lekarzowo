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

class AdminAddRoom extends React.Component {
constructor(props){
  super(props);
  this.state = {
    room: {
      number: "",
      localId: ""
    },

    loading: false
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
  console.log(value.id);
}

handleClickAddRoom(event){
  this.setState ({
    errors: Validation.validateAdminAddRoom(this.state.room.localId,
    this.state.room.number)
  }, () => {
    console.log(this.state.errors);
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

    }else {

      AdminService.postRoom(this.state.room)
      .then(response => {
        console.log(response);
        this.setState({
          room: {
            number: "",
            localId: ""
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
      <a className = 'subheader-content-profile'>Dodaj Pokój</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <Autocomplete
            requestCallback = {AdminService.getLocals}
            title = "Lokal"
            changeCallback = {this.onClickLocalSearch}
            dataTestId = 'autocomplete-local'
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
