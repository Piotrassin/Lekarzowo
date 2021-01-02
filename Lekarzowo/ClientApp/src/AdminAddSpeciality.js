import React from 'react';
import SicknessItem from './components/SicknessItem.js';
import AdminService from './services/AdminService.js';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from './helpers/Snackbar.js';
import Autocomplete from './components/Autocomplete.js';

class AdminAddSpeciality extends React.Component {
constructor(props){
  super(props);
  this.state = {
    speciality: {
      name: "",
      price: ""
    },
    loading: false
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickAddSpeciality = this.handleClickAddSpeciality.bind(this);
}

snackbarRef = React.createRef();

onChangeTextField(event){
  var targetName = event.target.name;
  var targetValue = event.target.value;
  this.setState(prevState => ({
    speciality: {
      ...prevState.speciality,
      [targetName]: targetValue
    }
  }));
}

handleClickAddSpeciality(event){
  AdminService.postSpeciality(this.state.speciality)
  .then(response => {
    console.log(response);
    this.setState({
      speciality: {
        name: "",
        price: ""
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

componentDidMount() {

}

render() {
  return(
    <div className = 'admin-content-holder flex-column' >
      <a className = 'subheader-content-profile'>Dodaj Specializację</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <TextField id="name" name="name"
            label="Nazwa specializacji"
            value = {this.state.name}
            onChange = {this.onChangeTextField}
            type = 'text'
            size="small" fullWidth />
            <br/>
            <TextField id="price" name="price"
            label="Cena bazowa za wizytę"
            value = {this.state.price}
            onChange = {this.onChangeTextField}
            type = 'number'
            size="small" fullWidth />
          </div>

          <br/><br/>
          <div>
          <a className = 'button-green' onClick = {this.handleClickAddSpeciality}>Dodaj</a>
          </div>
          </form>
          </div>
        <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminAddSpeciality;
