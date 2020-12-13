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
import { Dialog } from './components/Dialog.js';


const currentUserRole = AuthService.getUserCurrentRole();

class VisitDetails extends React.Component {
  constructor(props){
    super(props);
    var id = window.location.href.split('visit/')[1];
    var openVisit = false;
    if(VisitService.checkIfAnyOpenVisit()){
      if(VisitService.getOpenedVisit().id == id){
        openVisit = true;
      }
    }
    this.state = {
      id: id,
      patientId: JSON.parse(AuthService.getLoggedUser()).id,
      openedVisit: openVisit,
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
      clicked: {
        medicine: null,
        treatment: null,
        sickness: null
      }
    }
    this.getMedicineHistory = this.getMedicineHistory.bind(this);
    this.getSicknessHistory = this.getSicknessHistory.bind(this);
    this.getTreatmentHistory = this.getTreatmentHistory.bind(this);
    this.getActiveMedicine = this.getActiveMedicine.bind(this);
    this.getVisit = this.getVisit.bind(this);
    this.handleClickBtnVisit = this.handleClickBtnVisit.bind(this);
    this.handleClickAddMedicine = this.handleClickAddMedicine.bind(this);
    this.onClickAddMedicine = this.onClickAddMedicine.bind(this);
    this.onClickAddTreatment = this.onClickAddTreatment.bind(this);
    this.onClickAddSickness = this.onClickAddSickness.bind(this);
    this.handleClickAddMedicineDialogBtn = this.handleClickAddMedicineDialogBtn.bind(this);
    this.handleClickAddTreatmentDialogBtn = this.handleClickAddTreatmentDialogBtn.bind(this);
    this.handleClickAddSicknessDialogBtn = this.handleClickAddSicknessDialogBtn.bind(this);
  }

  componentDidMount() {

this.getSicknessHistory();
this.getActiveMedicine();
this.getVisit();
      /*fetch('https://localhost:44360/api/visits/details/' + this.props.id)
        .then(response => response.json())
        .then(dataMine =>
          this.setState({ medicineHistory: dataMine.map(item => {
            var med_arr = item.medicineName.split(" ");
            return {name: med_arr[0], dose: med_arr[1], medicineHistoryDescription: item.medicineHistoryDescription};
          }),
        sicknessHistory:  dataMine.map(item => {

          return {name: item.illnessName, startDate: item.medicineHistoryStartDate, endDate:  item.medicineHistoryEndDate};
        }),
        treatmentHistory:  dataMine.map(item => {

          return {treatmentName: item.treatmentName, treatmentOnVisitDescription: item.treatmentOnVisitDescription};
        }),
        name: dataMine[0].patientName,
        surname: dataMine[0].patientLastname,
        reservationId: dataMine[0].reservationId
       })
          //console.log(dataMine)
        )
        .catch(err => console.log(err));*/

  }

  getVisit(){
    ReservationService.getVisitDetails(this.state.id)
    .then(response => {
      this.setState({
        description: response.description,

      })
    })
  }

  getMedicineHistory() {




  }
  getSicknessHistory() {
    ReservationService.getPastIllnesses(3)
    .then(response => {
      this.setState({
        sicknessHistory: response
      })
    });
  }

  getActiveMedicine(){
    ReservationService.getTakenMedicine(2)
    .then(response => {
      this.setState({
        takenMedicine: response
      });
    });
  }

  getTreatmentHistory() {
    return this.state.treatmentHistory.filter((v,i,a)=>a.findIndex(t=>(t.treatmentName === v.treatmentName && t.treatmentOnVisitDescription===v.treatmentOnVisitDescription))===i);
  }

  handleClickBtnVisit(event) {
    console.log('Hello');
    if(VisitService.getOpenedVisit() == false){
      var state = VisitService.startVisit(this.state.id);
      this.setState({
        openedVisit: state
      });
    }else {
      console.log('Masz aktywną wizytę');
      if(VisitService.getOpenedVisit().id == this.state.id){
        VisitService.endVisit();
        this.setState({
          openedVisit: false
        });
      }else {
        console.log('Nie mozesz zakonczyc tej wiizty');
      }

    }
  }

  handleClickAddMedicine(event){
    event.preventDefault();

    Dialog.open("medicine-dialog")(event);
  }

  handleClickAddTreatment(event){
    event.preventDefault();

    Dialog.open("treatment-dialog")(event);
  }

  handleClickAddSickness(event){
    event.preventDefault();

    Dialog.open("sickness-dialog")(event);
  }

  onClickAddMedicine(medicine) {
    console.log("outside");
    console.log(medicine);
    this.setState({
      clicked:{
        medicine: medicine
      }
    });
  }

  onClickAddTreatment(treatment) {
    console.log("outside");
    console.log(treatment);
    this.setState({
      clicked:{
        treatment: treatment
      }
    });
  }

  onClickAddSickness(sickness) {
    console.log("outside");
    console.log(sickness);
    this.setState({
      clicked:{
        sickness: sickness
      }
    });
  }


  handleClickAddMedicineDialogBtn(event){
    this.state.visitMedicine.push(this.state.clicked.medicine);
    console.log(this.state.visitMedicine);
    this.setState({
      clicked: {
        medicine: null
      }
    });
    Dialog.close("medicine-dialog")(event);
  }

  handleClickAddTreatmentDialogBtn(event){
    this.state.visitTreatment.push(this.state.clicked.treatment);
    console.log(this.state.visitTreatment);
    this.setState({
      clicked: {
        treatment: null
      }
    });
    Dialog.close("treatment-dialog")(event);
  }

  handleClickAddSicknessDialogBtn(event){
    this.state.visitSickness.push(this.state.clicked.sickness);
    console.log(this.state.visitSickness);
    this.setState({
      clicked: {
        sickness: null
      }
    });
    Dialog.close("sickness-dialog")(event);
  }

  render(){
    var sicknesses = this.state.sicknessHistory;
    var medicines = this.getMedicineHistory()
    var treatments = this.getTreatmentHistory();
    return(

      <div className = "VisitPanels">
      <Menu history= {this.props.history}/>
        <div className = {currentUserRole == 'doctor' ? 'visit-summary' : 'visit-summary summary-long'}>

          <div className = "headline-container">
            <b className = "headline">Wizyta nr {this.state.id}</b>
            <RoleButton history= {this.props.history}/>
          </div>
          <div className = 'subheadline-container'>
          <b className = "subheadline">17:15 - 20:20</b>
          </div>
          <div className = 'row-container row-container-small'>
          <div className = "active-treatments basic-container">

            <b className = "standard-black">Notatki lekarza (wywiad, badanie, diagnoza, zalecenia)</b>

            {currentUserRole == 'doctor' ?
            <TextField
            id="doctor-notes-input"
            label="Notatki"
            placeholder="Zacznij pisać..."
            className = "textField"
            multiline
            />

            :
            <div/>
            }
            <br/>
            <a>{this.state.description}</a>

          </div>
          </div>
          <div className = "row-container">
          <div className = "flex-column justify-content-space column-container">
            <div className = "basic-container-small basic-container">
              <b className = "standard-black">Zdiagnozowane choroby</b>
              {this.state.visitSickness && this.state.visitSickness.map((sickness, index) => (
                <div><a id = {sickness.id}>{sickness.name}</a></div>
              ))}
              <img src={plusSign}  style = {{width: "40px", cursor: "pointer"}} onClick = {this.handleClickAddSickness} className = 'plusSign'/>

            </div>
            <div className = "basic-container-small basic-container">

              <b className = "standard-black">Zlecone leki</b>
              {this.state.visitMedicine && this.state.visitMedicine.map((medicine, index) => (
                <div><a id = {medicine.id}>{medicine.name}</a></div>
              ))}
              <img src={plusSign}  style = {{width: "40px", cursor: "pointer"}} onClick = {this.handleClickAddMedicine} className = 'plusSign'/>
            </div>
          </div>
          <div className = "flex-column justify-content-space column-container">
            <div className = "active-medicine basic-container">

              <b className = "standard-black">Wykonane zabiegi</b>
              <img src={plusSign}  style = {{width: "40px", cursor: "pointer"}} className = 'plusSign' onClick = {this.handleClickAddTreatment}/>
              {this.state.visitTreatment && this.state.visitTreatment.map((treatment, index) => (
                <div><a id = {treatment.id}>{treatment.name}</a></div>
              ))}

            </div>
            </div>


          </div>
          {currentUserRole == 'doctor' ?
          <button className = "btn-end-visit" onClick = {this.handleClickBtnVisit}>{this.state.openedVisit ? 'Zakończ wizytę' : 'Rozpocznij wizytę'}</button>
          :
          <div />
        }

        </div>
        {currentUserRole == 'doctor' ?
        <div className = "visit-member">
          <b className = "standard-dashed">Profil Pacjenta</b>
          <b className = "big-white">{this.state.name} {this.state.surname}</b>
          <img src={womanAvatar} alt="Avatar" className = "avatar"/>
          <div className = "medicine-history">
            <b className = "standard-dashed left-margin-small">Przyjmowane Leki</b>
            {this.state.takenMedicine && this.state.takenMedicine.map((medicine, index ) => (
            <MedicineSmall
              image = {medicine1}
              medicineName = {medicine.medicineName}
              dose = {medicine.medicineDosage}

              />
              ))}
          </div>
          <div className = "medicine-history">
            <b className = "standard-dashed left-margin-small">Przebyte Choroby</b>
            {this.state.sicknessHistory && this.state.sicknessHistory.map((illness, index ) => (
              <SicknessSmall
              sickness = {illness}
              id = {illness.illnessHistoryId}
              />
            ))}
          </div>
        </div>
        :
        <div/>
      }
      <Dialog id = "medicine-dialog">
        <div className = "header-dialog">
          <a>Dodaj lek</a>
        </div>
        <br/>
        <a className = 'dialog-margin dialog-text' >Dodawanie leku</a>
        <br/>
        <Autocomplete
        requestCallback = {VisitService.getAvailableMedicine}
        changeCallback = {this.onClickAddMedicine}
        title = "Lek"
        cssId = 'medicine-search'
        className = 'dialog-margin'
        styles = {{ width: "94%", marginTop: "20px", marginLeft: "20px" }}
        />
        <br/>
        <div className = 'dialog-btn-hold'>
          <a className = 'btn-dialog-cancel'>Anuluj</a>
          <a className = 'btn-dialog-primary' onClick = {this.handleClickAddMedicineDialogBtn}>Zatwierdź</a>
        </div>
      </Dialog>
      <Dialog id = "treatment-dialog">
        <div className = "header-dialog">
          <a>Dodaj Zabieg</a>
        </div>
        <br/>
        <a className = 'dialog-margin dialog-text' >Dodawanie zabiegu</a>
        <br/>
        <Autocomplete
        requestCallback = {VisitService.getAvailableTreatments}
        changeCallback = {this.onClickAddTreatment}
        title = "Zabieg"
        cssId = 'medicine-search'
        className = 'dialog-margin'
        styles = {{ width: "94%", marginTop: "20px", marginLeft: "20px" }}
        />
        <br/>
        <div className = 'dialog-btn-hold'>
          <a className = 'btn-dialog-cancel' onClick={this.handleClick} >Anuluj</a>
          <a className = 'btn-dialog-primary' onClick = {this.handleClickAddTreatmentDialogBtn}>Zatwierdź</a>
        </div>
      </Dialog>
      <Dialog id = "sickness-dialog">
        <div className = "header-dialog">
          <a>Dodaj Chorobę</a>
        </div>
        <br/>
        <a className = 'dialog-margin dialog-text' >Dodawanie choroby</a>
        <br/>
        <Autocomplete
        requestCallback = {VisitService.getAvailableSicknesses}
        changeCallback = {this.onClickAddSickness}
        title = "Zabieg"
        cssId = 'medicine-search'
        className = 'dialog-margin'
        styles = {{ width: "94%", marginTop: "20px", marginLeft: "20px" }}
        />
        <br/>
        <div className = 'dialog-btn-hold'>
          <a className = 'btn-dialog-cancel' onClick={this.handleClick} >Anuluj</a>
          <a className = 'btn-dialog-primary' onClick = {this.handleClickAddSicknessDialogBtn}>Zatwierdź</a>
        </div>
      </Dialog>
      </div>
    );
  }
}

export default VisitDetails;
