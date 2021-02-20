import React from 'react';
import AdminService from './services/AdminService.js';
import TextField from '@material-ui/core/TextField';
import Snackbar from './helpers/Snackbar.js';
import Validation from './helpers/Validation.js';
import DoctorService from './services/DoctorService.js';
import Autocomplete from './components/Autocomplete.js';

class AdminShowWorkingHours extends React.Component {
constructor(props){
  super(props);

  this.state = {
    doctorSelected: "",
    localSelected: "",
    list: [],
    loading: false,
    clear: 1,
    clear1: 2
  };

  this.onClickDoctorSearch = this.onClickDoctorSearch.bind(this);
  this.onClickLocalSearch = this.onClickLocalSearch.bind(this);

}
snackbarRef = React.createRef();

componentDidMount() {
  //this.showList();
}

showList(doctor, local) {
  this.setState({
    loading: true
  });
  AdminService.getAllWorkingHours(doctor, local)
  .then(response => {
    this.setState({
      list: response,
      loading: false
    });
  })
  .catch(err => {
    console.log(err.message);
    this.setState({
      loading: false
    });
  })
}

onClickDoctorSearch(value) {
  this.setState({
    doctorSelected: value.id,
    localSelected: null,
    clear1: this.state.clear1 + 1,
  });
}

onClickLocalSearch(value) {
  this.setState({
    localSelected: value.id
  }, () => {
    this.showList(this.state.doctorSelected, this.state.localSelected);
  });
}

render() {
  return(
    <div className = 'admin-content-holder flex-column' >
      <a className = 'subheader-content-profile'>Lista Godzin pracy</a>
      <div className = 'flex-column width-100'>
        <div className = 'flex-column width-100'>
        <Autocomplete
        requestCallback = {DoctorService.getDoctors}
        title = "Doktor"
        changeCallback = {this.onClickDoctorSearch}
        dataTestId = 'autocomplete-doctor'
        key = {this.state.clear}
        />
        <br/>
        {(this.state.doctorSelected == undefined || this.state.doctorSelected == "") ?
          <div/>
          :
        <Autocomplete
        requestCallback = {AdminService.getLocalsByDoctorId}
        title = "Lokal"
        dataTestId  = 'autocomplete-local'
        changeCallback = {this.onClickLocalSearch}
        key = {this.state.clear1}
        addId = {
          (this.state.doctorSelected == undefined || this.state.doctorSelected == "")  ? -1 : this.state.doctorSelected
        }
        />
      }
      {(this.state.doctorSelected == undefined || this.state.doctorSelected == "") || (this.state.localSelected == undefined || this.state.localSelected == "")?
        <div/>
        :
        <div>
        <br/>
          <div className = 'sickness-item'>
            <div className = 'sickness-item-part part-1-2-3-4-5'>
              <a className = 'table-header'>Godziny Pracy</a>
            </div>
          </div>
          {this.state.loading == true ?
            <div className = 'sickness-item'>
              <div className = 'sickness-item-part part-1-2-3-4-5'>
                <a className = 'table-header'>Pobieranie...</a>
              </div>
            </div>
            :
            <div/>
          }
          {this.state.list.length > 0 && this.state.list.map((object, index ) => (
            <div className = 'sickness-item'>
              <div className = 'sickness-item-part part-1-2-3-4-5'>
                <a>{object.name}</a>
              </div>
            </div>
          ))}
          </div>
        }
        </div>
      </div>
      <Snackbar ref = {this.snackbarRef} classes = 'green-snackbar' />
    </div>
  );
}

}
export default AdminShowWorkingHours;
