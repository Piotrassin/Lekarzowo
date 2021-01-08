import React from 'react';
import AdminService from './services/AdminService.js';
import UserService from './services/UserService.js';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Autocomplete from './components/Autocomplete.js';

class AdminEditRoom extends React.Component {
constructor(props){
  super(props);
  this.state = {
    roomNumber: "",
    loading: false,
    selectedObjectId: null,
    selectedRoomId: "",
    clear1: 1,
    clear2: 2
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickEdit = this.handleClickEdit.bind(this);
  this.onClickSearch = this.onClickSearch.bind(this);
  this.onClickRoomSearch = this.onClickRoomSearch.bind(this);
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
    selectedObjectId: value.id
  }, () => {
    console.log(this.state.selectedObjectId);
  });

}

onClickRoomSearch(value) {
  console.log(value);
  this.setState({
    selectedRoomId: value.id,
    roomNumber: value.name
  });

}

handleClickEdit(event){
  this.setState ({
    errors: Validation.validateUniversalBlank(this.state.roomNumber, "Pole Numer pokoju")
  }, () => {
    console.log(this.state.errors);
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

    }else {
      AdminService.putRoom(this.state.selectedRoomId, this.state.roomNumber, this.state.selectedObjectId)
      .then(response => {
        console.log(response);
        this.setState({
          selectedRoomId: null,
          selectedObjectId: null,
          roomNumber: "",
          clear1: this.state.clear1 -1,
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
      <a className = 'subheader-content-profile'>Edytuj Pokój w lokalu</a>
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
            {this.state.selectedObjectId == null ||  this.state.selectedObjectId === undefined ?
              <div/>
              :
            <Autocomplete
            requestCallback = {AdminService.getRoomsByLocalId}
            title = "Pokój"
            changeCallback = {this.onClickRoomSearch}
            dataTestId = 'autocomplete-rooms'
            key = {this.state.clear2}
            addId = {
              this.state.selectedObjectId == undefined ? -1 : this.state.selectedObjectId
            }
            />
          }
            <br/>
            {this.state.selectedRoomId == "" ||  this.state.selectedObjectId === null ?
              <div/>
              :
            <TextField id="roomNumber" name="roomNumber"
            label="Numer pokoju"
            value = {this.state.roomNumber}
            onChange = {this.onChangeTextField}
            type = 'number'
            size="small" fullWidth />
          }
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
export default AdminEditRoom;
