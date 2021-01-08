import React from 'react';
import AdminService from './services/AdminService.js';
import UserService from './services/UserService.js';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import Autocomplete from './components/Autocomplete.js';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

class AdminAddDoctor extends React.Component {
constructor(props){
  super(props);

  this.state = {
    specializationArray: [],
    name: "",
    lastname: "",
    birthdate: "1999-01-01",
    email: "",
    password: "",
    gender: "X",
    pesel: "",
    specialityId: null,
    clear: 1
  };

  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickAddDoctor = this.handleClickAddDoctor.bind(this);
  this.onClickSpecializationSearch = this.onClickSpecializationSearch.bind(this);
  this.handleGenferChange = this.handleGenferChange.bind(this);
}

snackbarRef = React.createRef();

onChangeTextField(event){
  this.setState({
      [event.target.name]: event.target.value
  });;
}



onClickSpecializationSearch(value) {
  this.setState({
    specialityId: value.id
  });
}

handleGenferChange(event){
  this.setState({
    gender: event.target.value
  });
  this.setState(prevState => ({
    touched: {
      ...prevState.touched,
      user: true
    }
  }));
}


handleClickAddDoctor(event){
  this.setState ({
    errors: Validation.validateAdminAddDoctor(this.state.specialityId, this.state.name, this.state.lastname,
      this.state.birthdate, this.state.email, this.state.password, this.state.gender,
      this.state.pesel)
  }, () => {
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');
    }else {
      var doctorObject = {
        name: this.state.name,
    	  lastname: this.state.lastname,
    	  birthdate: this.state.birthdate,
    	  email: this.state.email,
    	  password: {
    		  value: this.state.password
    	  },
    	  gender: this.state.gender,
    	  pesel: this.state.pesel,
    	  specialityId: this.state.specialityId
      }

      AdminService.postDoctor(doctorObject)
      .then(response => {
        console.log(response);
        this.setState({
          specializationArray: [],
          name: "",
          lastname: "",
          birthdate: "1999-01-01",
          email: "",
          password: "",
          gender: "M",
          pesel: "",
          specialityId: null,
          clear: this.state.clear + 1
        });
        this.snackbarRef.current.openSnackBar('Dodano lekarza', 'green-snackbar');
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
      <a className = 'subheader-content-profile'>Dodaj lekarza</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <Autocomplete
            requestCallback = {UserService.getSpecializations}
            title = "Specjalizacja"
            changeCallback = {this.onClickSpecializationSearch}
            noOptionsText={'Your Customized No Options Text'}
            key = {this.state.clear}
            />
            <br/>
            <TextField id="name" name="name"
            label="Imię"
            value = {this.state.name}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
            <br/>
            <TextField id="lastname" name="lastname"
            label="Nazwisko"
            value = {this.state.lastname}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
            <br/>
            <TextField id="birthdate" name="birthdate"
            label="Data urodzenia"
            value = {this.state.birthdate}
            onChange = {this.onChangeTextField}
            type = 'date'
            size="small" fullWidth />
            <br/>
            <TextField id="email" name="email"
            label="Email"
            value = {this.state.email}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
            <br/>
            <TextField id="password" name="password"
            label="Hasło"
            value = {this.state.password}
            onChange = {this.onChangeTextField}
            type = 'password'
            size="small" fullWidth />
            <br/>
            <InputLabel style={{fontSize: '12.5px'}} >Płeć</InputLabel>
            <Select

            value={this.state.gender}
            onChange={this.handleGenferChange}
            fullWidth
            label="Płeć"
            size="small"
            >
              <MenuItem value={"X"}>Wolę nie podawać</MenuItem>
              <MenuItem value={"M"}>Mężczyzna</MenuItem>
              <MenuItem value={"K"}>Kobieta</MenuItem>
            </Select>
            <br/>
            <TextField id="pesel" name="pesel"
            label="PESEL"
            value = {this.state.pesel}
            onChange = {this.onChangeTextField}
            type = 'number'
            size="small" fullWidth />
          </div>
          <br/><br/>
          <div>
            <a className = 'button-green' onClick = {this.handleClickAddDoctor}>Dodaj</a>
          </div>
        </form>
      </div>
      <Snackbar ref = {this.snackbarRef} />
    </div>
  );
}

}
export default AdminAddDoctor;
