import React from "react"
import './Main.css';
import womanAvatar from './images/womanAvatar.jpg';
import medicine1 from './images/medicine1.png';
import plusSign from './images/plusSign.svg';
import MedicineSmall from './MedicineSmall';
import { withStyles } from '@material-ui/core/styles';
import MedicineBigger from './MedicineBigger';
import TreatmenrSmall from './TreatmenrSmall';
import SicknessSmall from './SicknessSmall';
import Menu from './Menu.js';
import Autocomplete from './components/Autocomplete.js';
import TextField from '@material-ui/core/TextField';
import UserService from './services/UserService.js';
import ReservationService from './services/ReservationService.js';
import VisitService from './services/VisitService.js';
import AuthService from './authentication/AuthService';
import RoleButton from './components/RoleButton.js';
import SicknessOnVisitItem from './components/SicknessOnVisitItem.js';
import TreatmentOnVisitItem from './components/TreatmentOnVisitItem.js';
import MedicineOnVisitItem from './components/MedicineOnVisitItem.js';
import { Dialog } from './components/Dialog.js';
import Snackbar from './helpers/Snackbar.js';
import Formater from './helpers/Formater.js';
import SicknessPatientItem from './components/SicknessPatientItem.js';
import MedicinePatientItem from './components/MedicinePatientItem.js';
import Validation from './helpers/Validation.js';

const currentUserRole = AuthService.getUserCurrentRole();
const WhiteTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& label': {
      color: 'white',
    },
    '& .MuiOutlinedInput-input': {
      color: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
  },
})(TextField);

class PatientHistory extends React.Component {
  constructor(props){
    super(props);
    var id = window.location.href.split('patientHistoryMore/')[1].split('?')[0];
    var visitId = window.location.href.split('?visit=')[1];
    console.log('ID');
    console.log(id);

    this.state = {
      refresh: false,
      id: id,
      visitId: visitId,
      patientId: "",
      patientName: "",
      patientLastname: "",
      startDate: null,
      endDate: null,
      clear: false,
      medicineHistory: [],
      sicknessHistory: [],
      treatmentHistory: [],
      visitMedicine: [],
      visitTreatment: [],
      visitSickness: [],
      takenMedicine: [],
      name: "",
      surname: "",
      reservationId: "",
      description: "",
      addedDescription: "",
      showVisitStateBtn: false,
      clicked: {
        medicine: null,
        descriptionMedicine: "",
        medicineFinishDate: "",
        descriptionSickness: "",
        sickness: null,
        sicknessforMedicine: null,
        diagnoseDate: new Date().toISOString().split('T')[0],
        cureDate: ""
      }
    }
    this.handleBack = this.handleBack.bind(this);
    this.handleChangeSicknessDescription = this.handleChangeSicknessDescription.bind(this);
    this.handleChangeMedicineDescription = this.handleChangeMedicineDescription.bind(this);
    this.onClickAddSickness = this.onClickAddSickness.bind(this);
    this.onClickAddMedicine = this.onClickAddMedicine.bind(this);
    this.handleChangeSicknessDiagnoseDate = this.handleChangeSicknessDiagnoseDate.bind(this);
    this.handleChangeSicknessCureDate= this.handleChangeSicknessCureDate.bind(this);
    this.handleChangeMedicineFinishDate = this.handleChangeMedicineFinishDate.bind(this);
    this.handleClickAddSickness = this.handleClickAddSickness.bind(this);
    this.handleClickAddMedicine = this.handleClickAddMedicine.bind(this);
  }
  snackbarRef = React.createRef();

  componentDidMount() {

    this.getSicknessHistory();
    this.getActiveMedicine();
    this.getReservation();

  }

  clearSicknessAdd() {
    this.setState(prevState => ({
        ...prevState,
        clear: !prevState.clear,
        clicked: {
          ...prevState.clicked,
          descriptionSickness: "",
          sickness: null,
          diagnoseDate: new Date().toISOString().split('T')[0],
          cureDate: ""
        }
    }));
  }

  clearMedicineAdd() {
    this.setState(prevState => ({
        ...prevState,
        clear: !prevState.clear,
        clicked: {
          ...prevState.clicked,
          descriptionMedicine: "",
          medicine: null,
          medicineFinishDate: ""
        }
    }));
  }

  handleBack(event){
    this.props.history.push('/visit/' + this.state.visitId);
  }

  getReservation(){
    ReservationService.getReservation(this.state.visitId)
    .then(response => {
      console.log("Rezerwacja");
      console.log(response);
      this.setState({
        patientId: response.patientId,
        patientName: response.patientName,
        patientLastname: response.patientLastname,
        startDate: response.starttime,
        endDate: response.endtime
      });
    })
    .catch(err => {
        this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
    });
  }




  handleChangeMedicineDescription(event) {
    console.log(event.target.value);
    var newValue = event.target.value;
    this.setState(prevState => ({
        clicked: {
          ...prevState.clicked,
          descriptionMedicine: newValue
        }
    }));
  }

  handleChangeMedicineFinishDate(event){
    console.log(event.target.value);
    var newValue = event.target.value;
    this.setState(prevState => ({
        clicked: {
          ...prevState.clicked,
          medicineFinishDate: newValue
        }
    }));
  }

  handleChangeSicknessDiagnoseDate(event) {
    console.log('End date medicine value:');
    console.log(event.target.value);
    console.log(new Date(event.target.value));
    var newValue = event.target.value;
    this.setState(prevState => ({
        clicked: {
          ...prevState.clicked,
          diagnoseDate: newValue
        }
    }));
  }

  handleChangeSicknessCureDate(event) {
    console.log('End date medicine value:');
    console.log(event.target.value);
    console.log(new Date(event.target.value));
    var newValue = event.target.value;
    this.setState(prevState => ({
        clicked: {
          ...prevState.clicked,
          cureDate: newValue
        }
    }));
  }


  handleChangeSicknessDescription(event) {
    console.log(event.target.value);
    var newValue = event.target.value;
    this.setState(prevState => ({
        clicked: {
          ...prevState.clicked,
          descriptionSickness: newValue
        }
    }));
  }

  getSicknessHistory() {
    ReservationService.getPastIllnessesPatient(this.state.id, "")
    .then(response => {
      this.setState({
        sicknessHistory: response
      })
    })
    .catch(err => {
        this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
    });
  }

  getActiveMedicine(){
    ReservationService.getTakenMedicinePatient(this.state.id, "")
    .then(response => {
      this.setState({
        takenMedicine: response
      });
    })
    .catch(err => {
        this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
    });
  }


  handleChangeDescription(event){
    this.setState({
      description: event.target.value
    });
  }

  handleClickAddMedicine(event){

        this.setState ({
          errors: Validation.validateOldMedicineAdd(this.state.clicked.medicine, this.state.clicked.descriptionMedicine,
            this.state.clicked.medicineFinishDate)
        }, () => {
          console.log(this.state.errors);
          if(Object.keys(this.state.errors).length > 0){
            var message = Validation.handleValidationOutcome(this.state.errors);
            this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

          }else {
            var oldIllnessHistoryObject = {
              "medicineId": this.state.clicked.medicine.id,
              "patientId": this.state.id,
              "finishDate": this.state.clicked.medicineFinishDate,
              "description": this.state.clicked.descriptionMedicine
            }
            VisitService.postOldMedicinehistory(oldIllnessHistoryObject)
            .then(response => {
              this.snackbarRef.current.openSnackBar( 'Dodano' ,'green-snackbar');
              this.clearMedicineAdd();
            })
            .catch(err => {
                this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
            });
          }
        });
  }


  handleClickAddSickness(event){


    this.setState ({
      errors: Validation.validateOldIllnessAdd(this.state.clicked.sickness, this.state.clicked.descriptionSickness,
        this.state.clicked.diagnoseDate, this.state.clicked.cureDate)
    }, () => {
      console.log(this.state.errors);
      if(Object.keys(this.state.errors).length > 0){
        var message = Validation.handleValidationOutcome(this.state.errors);
        this.snackbarRef.current.openSnackBar( message ,'red-snackbar');

      }else {
        var oldIllnessHistoryObject = {
          "illnessId": this.state.clicked.sickness.id,
          "patientId": this.state.id,
          "diagnoseDate": this.state.clicked.diagnoseDate,
          "description": this.state.clicked.descriptionSickness,
          "cureDate": this.state.clicked.cureDate
        }
        VisitService.postOldillnesshistory(oldIllnessHistoryObject)
        .then(response => {
          this.snackbarRef.current.openSnackBar( 'Dodano' ,'green-snackbar');
          this.clearSicknessAdd();
        })
        .catch(err => {
            this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
        });
      }
    });


  }

  onClickAddMedicine(medicine) {
    console.log("outside");
    console.log(medicine);
    this.setState(prevState => ({
      clicked:{
        ...prevState.clicked,
        medicine: medicine
      }
    }));
  }


  onClickAddSickness(sickness) {
    console.log("outside");
    console.log(sickness);
    this.setState(prevState => ({
      clicked:{
        ...prevState.clicked,
        sickness: sickness
      }
    }));
  }






  render(){
    return(

      <div className = "VisitPanels">
      <Menu history= {this.props.history}/>

        {currentUserRole == 'doctor' ?
        <div className = "visit-member-long">
        <a style={{color: 'white'}} onClick={this.handleBack}> Powrót</a>
          <b className = "big-white" style={{marginBottom: '10px'}}>{this.state.patientName} {this.state.patientLastname}</b>
          <a style={{color: '#E4E4E4', fontWeight: 'bold'}}>Przebyte choroby</a>
          <hr style= {{width: '100%'}} />
          <br/>
          <div className='overflow-y-auto' style={{width: '100%', height: '20vh'}}>
          {this.state.sicknessHistory && this.state.sicknessHistory.map((illness, index ) => (
            <SicknessPatientItem
            sickness = {illness}
            id = {illness.illnessHistoryId}
            />
          ))}
          </div>

          <div className = 'flex-row' style = {{width: '100%', marginBottom: '20px', marginTop: '20px'}}>
          <Autocomplete
          requestCallback = {VisitService.getAvailableSicknesses}
          changeCallback = {this.onClickAddSickness}
          title = "Choroba"
          cssId = 'medicine-search'
          variant = 'outlined'
          className = 'dialog-margin'
          clear = {this.state.clear}
          styles = {{ width: "94%", marginLeft: "20px" }}
          />

          <WhiteTextField id="descriptionSickness" name="descriptionSickness"
          label="Opis"
          value = {this.state.clicked.descriptionSickness}
          onChange = {this.handleChangeSicknessDescription}
          variant = 'outlined'
          rowsMax = {2}
          style = {{marginLeft: '20px', width: '94%'}}
          size="small" fullWidth />
          <WhiteTextField id="diagnoseDate" name="diagnoseDate"
          label="Data diagnozy"
          value = {this.state.clicked.diagnoseDate}
          onChange = {this.handleChangeSicknessDiagnoseDate}
          variant = 'outlined'

          rowsMax = {2}
          type = "date"
          style = {{marginLeft: '20px', width: '94%'}}
          size="small" fullWidth />
          <WhiteTextField id="cureDate" name="cureDate"
          label="Data wyleczenia"
          value = {this.state.clicked.cureDate}
          onChange = {this.handleChangeSicknessCureDate}
          variant = 'outlined'
          rowsMax = {2}
          InputLabelProps={{ shrink: true }}
          type = "date"
          style = {{marginLeft: '20px', width: '94%'}}
          size="small" fullWidth />
          </div>
          <div className = 'dialog-btn-hold' style = {{position: 'relative', width: '100%',  bottom: '0'}}>
          <a style={{color: '#C3C3C3', marginRight: '10px', padding: '10px'}}>Jeżeli pacjent chorował wcześniej, tutaj możesz dodać przeszłą chorobę niezwiązaną z wizytą</a>
            <a className = 'btn-dialog-primary' onClick = {this.handleClickAddSickness}>Dodaj</a>
          </div>
          <a style={{color: '#E4E4E4', fontWeight: 'bold'}}>Przyjmowane leki</a>
          <hr style= {{width: '100%'}} />
          <br/>
          <div className='overflow-y-auto' style={{width: '100%', height: '20vh'}}>
          {this.state.takenMedicine && this.state.takenMedicine.map((medicine, index ) => (
            <MedicinePatientItem
            image = {medicine1}
            medicineName = {medicine.medicineName}
            dose = {medicine.medicineDosage}
            finishDate = {medicine.finishdate}
            medicine = {medicine}
            />
          ))}
          </div>
          <div className = 'flex-row' style = {{width: '100%', marginBottom: '20px', marginTop: '20px'}}>
          <Autocomplete
          requestCallback = {VisitService.getAvailableMedicine}
          changeCallback = {this.onClickAddMedicine}
          title = "Lek"
          cssId = 'medicine-search'
          variant = 'outlined'
          className = 'dialog-margin'
          clear = {this.state.clear}
          styles = {{ width: "94%",  marginLeft: "20px" }}
          />

          <WhiteTextField id="descriptionMedicine" name="descriptionMedicine"
          label="Opis"
          value = {this.state.clicked.descriptionMedicine}
          onChange = {this.handleChangeMedicineDescription}
          variant = 'outlined'
          rowsMax = {2}
          style = {{marginLeft: '20px', width: '94%'}}
          size="small" fullWidth />
          <WhiteTextField id="medicineFinishDate" name="medicineFinishDate"
          label="Data zakonczenia"
          value = {this.state.clicked.medicineFinishDate}
          onChange = {this.handleChangeMedicineFinishDate}
          variant = 'outlined'
          rowsMax = {2}
          type = "date"
          InputLabelProps={{ shrink: true }}
          style = {{marginLeft: '20px', width: '94%'}}
          size="small" fullWidth />
          </div>
          <div className = 'dialog-btn-hold' style = {{position: 'relative', maxWidth: '100%',  bottom: '0'}}>
            <a style={{color: '#C3C3C3', marginRight: '10px', padding: '10px'}}>Jeżeli pacjent przyjmował wcześniej leki, tutaj możesz dodać poprzednio przyjmowane leki niezwiązaną z wizytą</a>
            <a className = 'btn-dialog-primary' onClick = {this.handleClickAddMedicine}>Dodaj</a>
          </div>





        </div>
        :
        <div/>
      }

      <Snackbar ref = {this.snackbarRef} />
      </div>
    );
  }
}

export default PatientHistory;
