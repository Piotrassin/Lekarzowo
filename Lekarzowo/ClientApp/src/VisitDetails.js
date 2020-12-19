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
      addedDescription: "",
      showVisitStateBtn: false,
      clicked: {
        medicine: null,
        descriptionMedicine: "",
        treatment: null,
        descriptionSickness: "",
        sickness: null,
        descriptionTreatment: ""
      }
    }
    this.getMedicineHistory = this.getMedicineHistory.bind(this);
    this.getSicknessHistory = this.getSicknessHistory.bind(this);
    this.getTreatmentHistory = this.getTreatmentHistory.bind(this);
    this.getActiveMedicine = this.getActiveMedicine.bind(this);
    this.getSicknessOnVisit = this.getSicknessOnVisit.bind(this);
    this.getTreatmentOnVisit = this.getTreatmentOnVisit.bind(this);
    this.getVisit = this.getVisit.bind(this);
    this.handleClickBtnVisit = this.handleClickBtnVisit.bind(this);
    this.handleClickAddMedicine = this.handleClickAddMedicine.bind(this);
    this.onClickAddMedicine = this.onClickAddMedicine.bind(this);
    this.onClickAddTreatment = this.onClickAddTreatment.bind(this);
    this.onClickAddSickness = this.onClickAddSickness.bind(this);
    this.handleClickAddMedicineDialogBtn = this.handleClickAddMedicineDialogBtn.bind(this);
    this.handleClickAddTreatmentDialogBtn = this.handleClickAddTreatmentDialogBtn.bind(this);
    this.handleClickAddSicknessDialogBtn = this.handleClickAddSicknessDialogBtn.bind(this);
    this.handleChangeMedicineDescription = this.handleChangeMedicineDescription.bind(this);
    this.handleChangeSicknessDescription = this.handleChangeSicknessDescription.bind(this);
    this.handleChangeTreatmentDescription = this.handleChangeTreatmentDescription.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
  }

  componentDidMount() {

this.getSicknessHistory();
this.getActiveMedicine();
this.getVisit();
this.getSicknessOnVisit();
this.getTreatmentOnVisit();

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

  handleChangeTreatmentDescription(event) {
    console.log(event.target.value);
    var newValue = event.target.value;
    this.setState(prevState => ({
        clicked: {
          ...prevState.clicked,
          descriptionTreatment: newValue
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

  getVisit(){
    ReservationService.getVisitDetails(this.state.id)
    .then(response => {
      this.setState({
        description: response.description,
      });
      if(this.state.openedVisit){
        console.log('Visit Exist and opened');
        this.setState({
          showVisitStateBtn: true
        });
      }else {
        console.log('Visit exist and not opened');
        this.setState({
          showVisitStateBtn: false
        });
      }

    })
    .catch(err => {
      console.log('Error');
    console.log(err);
      if(err.message == 404){
        console.log('Visit does not exist');
        this.setState({
          showVisitStateBtn: true
        });
      }
    });
  }

  getSicknessOnVisit(){
    VisitService.getSicknessOnVisit(this.state.id, 10, 0)
    .then(response => {
      this.setState({
        visitSickness: response
      });
      console.log(this.state.visitSickness);
    });
  }

  getTreatmentOnVisit(){
    VisitService.getTreatmentOnVisit(this.state.id, 10, 0)
    .then(response => {
      this.setState({
        visitTreatment: response
      });
      console.log(this.state.visitTreatment);
    });
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

  handleChangeDescription(event){
    this.setState({
      description: event.target.value
    });
  }

  handleClickBtnVisit(event) {
    console.log('Hello');
    if(VisitService.getOpenedVisit() == false){

      var state = VisitService.startVisit(this.state.id);
      if(state){
        VisitService.postVisit(this.state.id)
        .then(response => {
          this.setState({
            openedVisit: state
          });
        })
        .catch(err => {
          console.log('Error');
          console.log(err);
        })


      }

    }else {
      console.log('Masz aktywną wizytę');
      if(VisitService.getOpenedVisit().id == this.state.id){
        VisitService.putDescriptionOnVisit(this.state.id, this.state.description)
        .then(response => {
          VisitService.endVisit();
          this.setState({
            openedVisit: false
          });
          window.location.reload();
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
    this.setState(prevState => ({
      clicked:{
        ...prevState.clicked,
        medicine: medicine
      }
    }));
  }

  onClickAddTreatment(treatment) {
    console.log("outside");
    console.log(treatment);
    this.setState(prevState => ({
      clicked:{
        ...prevState.clicked,
        treatment: treatment
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

  handleClickAddDescriptionBtn(event) {

  }

  handleClickAddTreatmentDialogBtn(event){
    var treatmentVisitObject = {
      id : this.state.clicked.treatment.id,
      description: this.state.descriptionTreatment,
      visitId: this.state.id
    }
    VisitService.postTreatmentOnVisit(treatmentVisitObject)
    .then(response => {
      console.log(response);
    });

    this.state.visitTreatment.push({
      treatmentName: this.state.clicked.treatment.name,
      treatmentDescription: this.state.clicked.descriptionTreatment
    });
    console.log(this.state.visitTreatment);
    this.setState({
      clicked: {
        treatment: null
      }
    });
    Dialog.close("treatment-dialog")(event);
  }

  handleClickAddSicknessDialogBtn(event){
    var sicknessVisitObject = {
      id : this.state.clicked.sickness.id,
      description: this.state.descriptionSickness,
      visitId: this.state.id
    }
    VisitService.postSicknessOnVisit(sicknessVisitObject)
    .then(response => {
      console.log(response);
    });

    this.state.visitSickness.push({
      illnessName: this.state.clicked.sickness.name,
      illnessHistoryId: this.state.clicked.sickness.id
    });
    console.log(this.state.visitSickness);
    this.setState(prevState => ({
      clicked: {
        ...prevState.clicked,
        sickness: null,
        description: ''
      }
    }));
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

            {(currentUserRole == 'doctor' && this.state.openedVisit) ?

            <TextField
            id="doctor-notes-input"
            label="Notatki"
            placeholder="Zacznij pisać..."
            className = "textField"
            value = {this.state.description}
            onChange = {this.handleChangeDescription}
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
              {this.state.visitSickness.length > 0 && this.state.visitSickness.map((sickness, index) => (
                <div><a id = {sickness.illnessHistoryId}>{sickness.illnessName}</a></div>
              ))}
              {(currentUserRole == 'doctor' && this.state.openedVisit) ?
              <img src={plusSign}  style = {{width: "40px", cursor: "pointer"}} onClick = {this.handleClickAddSickness} className = 'plusSign'/>
              :
              <div/>
              }
            </div>
            <div className = "basic-container-small basic-container">

              <b className = "standard-black">Zlecone leki</b>
              {this.state.visitMedicine && this.state.visitMedicine.map((medicine, index) => (
                <div><a id = {medicine.id}>{medicine.name}</a></div>
              ))}
              {(currentUserRole == 'doctor' && this.state.openedVisit) ?
              <img src={plusSign}  style = {{width: "40px", cursor: "pointer"}} onClick = {this.handleClickAddMedicine} className = 'plusSign'/>
              :
              <div/>
              }
            </div>
          </div>
          <div className = "flex-column justify-content-space column-container">
            <div className = "active-medicine basic-container">

              <b className = "standard-black">Wykonane zabiegi</b>
              {(currentUserRole == 'doctor' && this.state.openedVisit) ?
              <img src={plusSign}  style = {{width: "40px", cursor: "pointer"}} className = 'plusSign' onClick = {this.handleClickAddTreatment}/>
              :
              <div/>
              }
              {this.state.visitTreatment && this.state.visitTreatment.map((treatment, index) => (
                <div><a id = {index}>{treatment.treatmentName}</a></div>
              ))}

            </div>
            </div>


          </div>
          {(currentUserRole == 'doctor' && this.state.showVisitStateBtn )?
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
        requestCallback = {VisitService.getSicknessOnVisitSearch}
        changeCallback = {this.onClickSelectedSicknessForMedicine}
        title = "Choroba"
        cssId = 'medicine-search'
        className = 'dialog-margin'
        variant = 'outlined'
        addId = {this.state.id}
        styles = {{ width: "94%", marginTop: "20px", marginLeft: "20px" }}
        />
        <br/>
        <Autocomplete
        requestCallback = {VisitService.getAvailableMedicine}
        changeCallback = {this.onClickAddMedicine}
        title = "Lek"
        cssId = 'medicine-search'
        variant = 'outlined'
        className = 'dialog-margin'
        styles = {{ width: "94%", marginTop: "20px", marginLeft: "20px" }}
        />
        <br/>
        <WhiteTextField id="descriptionMedicine" name="descriptionMedicine"
        label="Opis"
        value = {this.state.clicked.descriptionMedicine}
        onChange = {this.handleChangeMedicineDescription}
        variant = 'outlined'
        rowsMax = {2}
        style = {{marginLeft: '20px', width: '94%'}}
        size="small" fullWidth />
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
        variant = 'outlined'
        styles = {{ width: "94%", marginTop: "20px", marginLeft: "20px" }}
        />
        <br/>
        <WhiteTextField id="descriptionTreatment" name="descriptionTreatment"
        label="Opis"
        value = {this.state.clicked.descriptionTreatment}
        onChange = {this.handleChangeTreatmentDescription}
        variant = 'outlined'
        rowsMax = {2}
        style = {{marginLeft: '20px', width: '94%'}}
        size="small" fullWidth />
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
        title = "Choroba"
        cssId = 'medicine-search'
        variant = 'outlined'
        className = 'dialog-margin'
        styles = {{ width: "94%", marginTop: "20px", marginLeft: "20px" }}
        />
        <br/>
        <WhiteTextField id="descriptionSickness" name="descriptionSickness"
        label="Opis"
        value = {this.state.clicked.descriptionSickness}
        onChange = {this.handleChangeSicknessDescription}
        variant = 'outlined'
        rowsMax = {2}
        style = {{marginLeft: '20px', width: '94%'}}
        size="small" fullWidth />
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
