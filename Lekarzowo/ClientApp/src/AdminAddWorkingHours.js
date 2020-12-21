import React from 'react';
import SicknessItem from './components/SicknessItem.js';
import AdminService from './services/AdminService.js';
import DoctorService from './services/DoctorService.js';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from './helpers/Snackbar.js';
import Autocomplete from './components/Autocomplete.js';

class AdminAddWorkingHours extends React.Component {
constructor(props){
  super(props);
  this.state = {
    doctorsArray: [],
    dateStart: "1999-01-01",
    dateEnd: "1999-01-01",
    timeStart: "07:30",
    timeEnd: "22:00",
    loading: false,
    doctorSelected: null
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickAddIllness = this.handleClickAddIllness.bind(this);
  this.onClickDoctorSearch = this.onClickDoctorSearch.bind(this);
  this.onClickLocalSearch = this.onClickLocalSearch.bind(this);
}

snackbarRef = React.createRef();

onChangeTextField(event){
  this.setState({
      [event.target.name]: event.target.value
  });
}

onClickDoctorSearch(value) {
  this.setState({
    doctorSelected: value.id
  });
  console.log(value.id);
}

onClickLocalSearch(value) {
  this.setState({
    localSelected: value.id
  });
  console.log(value.id);
}


handleClickAddIllness(event){
  AdminService.postIllness(this.state.illnessName)
  .then(response => {
    console.log(response);
    this.setState({
      illnessName: ""
    });
    this.snackbarRef.current.openSnackBar('Zaktualizowano Dane', 'green-snackbar');
  })
  .catch(err => {
    this.snackbarRef.current.openSnackBar(err, 'red-snackbar');
  })
}

componentDidMount() {

}

render() {
  return(
    <div className = 'admin-content-holder flex-column' >
      <a className = 'subheader-content-profile'>Dodaj godziny pracy</a>
      <div className = 'flex-column width-100'>
        <form className = 'edit-user-form flex-column'>
          <div className = 'flex-column width-100'>
            <Autocomplete
            requestCallback = {DoctorService.getDoctors}
            title = "Doktor"
            changeCallback = {this.onClickDoctorSearch}

            />
            <br/>
            <Autocomplete
            requestCallback = {AdminService.getLocalsByDoctorId}
            title = "Lokal"
            changeCallback = {this.onClickLocalSearch}
            addId = {this.state.doctorSelected.id}
            />
            <br/>
            <TextField id="dateStart" name="dateStart"
            label="Data Od"
            value = {this.state.dateStart}
            onChange = {this.onChangeTextField}
            type = 'date'
            size="small" fullWidth />
            <br/>
            <TextField id="dateEnd" name="dateEnd"
            label="Data Do"
            value = {this.state.dateEnd}
            onChange = {this.onChangeTextField}
            type = 'date'
            size="small" fullWidth />
            <br/>
            <TextField id="timeStart" name="timeStart"
            label="Data Od"
            value = {this.state.timeStart}
            onChange = {this.onChangeTextField}
            type = 'time'
            size="small" fullWidth />
            <br/>
            <TextField id="timeEnd" name="timeEnd"
            label="Data Do"
            value = {this.state.timeEnd}
            onChange = {this.onChangeTextField}
            type = 'time'
            size="small" fullWidth />
          </div>

          <br/><br/>
          <div>
          <a className = 'button-green' onClick = {this.handleClickAddIllness}>Dodaj</a>
          </div>
          </form>
          </div>
        <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminAddWorkingHours;
