import React from 'react';
import SicknessItem from './components/SicknessItem.js';
import AdminService from './services/AdminService.js';
import DoctorService from './services/DoctorService.js';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from './helpers/Snackbar.js';
import Autocomplete from './components/Autocomplete.js';
import Validation from './helpers/Validation.js';
import Formater from './helpers/Formater.js';

class AdminAddWorkingHours extends React.Component {
constructor(props){
  super(props);
  this.state = {
    doctorsArray: [],
    dateStart: Formater.formatDate(new Date().toISOString()),
    dateEnd: Formater.formatDate(new Date().toISOString()),
    timeStart: "07:30",
    timeEnd: "22:00",
    loading: false,
    doctorSelected: null,
    localSelected: null
  };
  this.onChangeTextField = this.onChangeTextField.bind(this);
  this.handleClickAddWorkinghours = this.handleClickAddWorkinghours.bind(this);
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


handleClickAddWorkinghours(event){
  this.setState ({
    errors: Validation.validateAdminAddWorkingHours(this.state.doctorId, this.state.localId,
    this.state.dateStart, this.state.dateEnd, this.state.timeStart, this.state.timeEnd)
  }, () => {
    console.log(this.state.errors);
    if(Object.keys(this.state.errors).length > 0){
      var message = Validation.handleValidationOutcome(this.state.errors);
      this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

    }else {
      var workinghoursObject = {
        From: this.state.dateStart.concat('T').concat(this.state.timeStart),
        To: this.state.dateEnd.concat('T').concat(this.state.timeEnd),
        DoctorId: this.state.doctorSelected,
        LocalId: this.state.localSelected
      }
      AdminService.postWorkinghours(workinghoursObject)
      .then(response => {
        console.log(response);
        this.setState({
          dateStart: Formater.formatDate(new Date().toISOString()),
          dateEnd: Formater.formatDate(new Date().toISOString()),
          timeStart: "07:30",
          timeEnd: "22:00",
          doctorSelected: null,
          localSelected: null
        });
        this.snackbarRef.current.openSnackBar('Dodano godziny pracy', 'green-snackbar');
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
            {this.state.doctorSelected != undefined ?
            <Autocomplete
            requestCallback = {AdminService.getLocalsByDoctorId}
            title = "Lokal"
            changeCallback = {this.onClickLocalSearch}
            addId = {this.state.doctorSelected == undefined ? -1 : this.state.doctorSelected}
            />
            :
            <div/>
          }
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
          <a className = 'button-green' onClick = {this.handleClickAddWorkinghours}>Dodaj</a>
          </div>
          </form>
          </div>
        <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminAddWorkingHours;
