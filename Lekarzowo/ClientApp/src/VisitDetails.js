import React from "react"
import './Main.css';
import womanAvatar from './images/womanAvatar.jpg';
import medicine1 from './images/MedicineSmallRound.svg';
import plusSign from './images/plusSign.svg';
import MedicineSmall from './components/MedicineSmall.js';
import { withStyles } from '@material-ui/core/styles';
import sicknessSign from './images/SicknessSign.svg';
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

class VisitDetails extends React.Component {
  constructor(props){
    super(props);
    var id = window.location.href.split('visit/')[1];
    var openVisit = false;


    this.state = {
      snackbarRef: null,
      refresh: false,
      id: id,
      patientId: "",
      patientName: "",
      patientLastname: "",
      startDate: null,
      endDate: null,
      price: "",
      clearVar: false,
      clearSick: false,
      clear: {
        treatment: 1,
        sickness: 2,
        sicknessOnVisit: 3,
        medicine: 4
      },
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
        descriptionTreatment: "",
        sicknessforMedicine: null,
        endDate: ""
      }
    }
    this.getSicknessHistory = this.getSicknessHistory.bind(this);
    this.getTreatmentHistory = this.getTreatmentHistory.bind(this);
    this.getActiveMedicine = this.getActiveMedicine.bind(this);
    this.getSicknessOnVisit = this.getSicknessOnVisit.bind(this);
    this.getTreatmentOnVisit = this.getTreatmentOnVisit.bind(this);
    this.getReservation = this.getReservation.bind(this);
    this.getVisit = this.getVisit.bind(this);
    this.handleClickBtnVisit = this.handleClickBtnVisit.bind(this);
    this.handleClickAddMedicine = this.handleClickAddMedicine.bind(this);
    this.onClickAddMedicine = this.onClickAddMedicine.bind(this);
    this.onClickAddTreatment = this.onClickAddTreatment.bind(this);
    this.onClickAddSickness = this.onClickAddSickness.bind(this);
    this.getMedicineOnVisit = this.getMedicineOnVisit.bind(this);
    this.onClickSelectedSicknessForMedicine = this.onClickSelectedSicknessForMedicine.bind(this);
    this.handleClickAddMedicineDialogBtn = this.handleClickAddMedicineDialogBtn.bind(this);
    this.handleClickAddTreatmentDialogBtn = this.handleClickAddTreatmentDialogBtn.bind(this);
    this.handleClickAddSicknessDialogBtn = this.handleClickAddSicknessDialogBtn.bind(this);
    this.handleChangeMedicineDescription = this.handleChangeMedicineDescription.bind(this);
    this.handleChangeMedicineEndDate = this.handleChangeMedicineEndDate.bind(this);
    this.handleChangeSicknessDescription = this.handleChangeSicknessDescription.bind(this);
    this.handleChangeTreatmentDescription = this.handleChangeTreatmentDescription.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.putDescriptionOnVisit = this.putDescriptionOnVisit.bind(this);
    this.patientHistoryLoadMore = this.patientHistoryLoadMore.bind(this);
    this.openSnackbarOnRemove = this.openSnackbarOnRemove.bind(this);
  }


  componentDidMount() {
    this.setState({
      snackbarRef: React.createRef()
    }, () => {
      if(this.state.id){
        if(VisitService.checkIfAnyOpenVisit()){
          if(VisitService.getOpenedVisit().id == this.state.id){
            this.setState({
              openedVisit : true
            });
          }
        }
        this.getReservation()
        .then(response => {
            if(currentUserRole == 'doctor'){
              this.getSicknessHistory();
              this.getActiveMedicine();
            }

        })


        this.getVisit()
        .then(response => {
          this.getSicknessOnVisit();
          this.getTreatmentOnVisit();
          this.getMedicineOnVisit();
        })
        .catch(err => {
          console.log('Error');
          console.log(err);
          if(err.message == 404){
            console.log('Visit does not exist');
            VisitService.canVisitBeOpened(this.state.id)
            .then(response => {
              if(response == true){
                this.setState({
                  showVisitStateBtn: true
                });
              }else {
                this.setState({
                  showVisitStateBtn: false
                });
              }

            })
            .catch(err => {
              console.log(err.message);
            });

          }
        });
      }

    });

  }

  putDescriptionOnVisit(event){
    VisitService.putDescriptionOnVisit(this.state.id, this.state.description)
    .then(response => {
      this.state.snackbarRef.current.openSnackBar('Zaktualizowano notatkę', 'green-snackbar');
    }).catch(err => {
        try{
          this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
        }catch(erorr){
          console.log('Missed Reference');
        };
    });

  }

  patientHistoryLoadMore(event){
    if(this.state.patientId != ""){
        this.props.history.push("/patientHistoryMore/" + this.state.patientId + '?visit=' + this.state.id);
    }

  }



  getReservation(){
    return ReservationService.getReservationWithPatient(this.state.id)
    .then(response => {
      this.setState({
        patientId: response.patientId,
        patientName: response.patientName,
        patientLastname: response.patientLastname,
        startDate: response.starttime,
        endDate: response.endtime
      });
    })
    .catch(err => {
        try{
          this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
        }catch(erorr){
          console.log('Missed Reference');
        };
    });
  }

  openSnackbarOnRemove(content, classId, arrayName, item, idColumnName){
    this.state.snackbarRef.current.openSnackBar(content, classId);
    if(arrayName){
      this.setState(prevState => ({
        ...prevState,
        [arrayName]: prevState[arrayName].filter(el => {return el[idColumnName] != item.id })
      }));
    }

  }

  handleChangeMedicineDescription(event) {
    var newValue = event.target.value;
    this.setState(prevState => ({
        clicked: {
          ...prevState.clicked,
          descriptionMedicine: newValue
        }
    }));
  }

  handleChangeMedicineEndDate(event) {
    var newValue = event.target.value;
    this.setState(prevState => ({
        clicked: {
          ...prevState.clicked,
          endDate: newValue
        }
    }));
  }

  handleChangeTreatmentDescription(event) {
    var newValue = event.target.value;
    this.setState(prevState => ({
        clicked: {
          ...prevState.clicked,
          descriptionTreatment: newValue
        }
    }));
  }

  handleChangeSicknessDescription(event) {
    var newValue = event.target.value;
    this.setState(prevState => ({
        clicked: {
          ...prevState.clicked,
          descriptionSickness: newValue
        }
    }));
  }

  getVisit(){
    return ReservationService.getVisitDetails(this.state.id)
    .then(response => {
      this.setState({
        description: response.description,
        price: response.price
      });
      if(this.state.openedVisit){
        this.setState({
          showVisitStateBtn: true
        });
      }else {
        this.setState({
          showVisitStateBtn: false
        });
      }
      return response;
    })

  }

  getSicknessOnVisit(){
    VisitService.getSicknessOnVisit(this.state.id, 10, 0)
    .then(response => {
      this.setState({
        visitSickness: response
      });
    })
    .catch(err => {
        try{
          this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
        }catch(erorr){
          console.log('Missed Reference');
        };
    });
  }

  getTreatmentOnVisit(){
    VisitService.getTreatmentOnVisit(this.state.id, 10, 0)
    .then(response => {
      this.setState({
        visitTreatment: response
      });
    })
    .catch(err => {
        try{
          this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
        }catch(erorr){
          console.log('Missed Reference');
        };
    });
  }

  getMedicineOnVisit(){
    VisitService.getMedicineOnVisit(this.state.id, 10, 0)
    .then(response => {
      this.setState({
        visitMedicine: response
      });
      console.log(this.state.visitMedicine);
    })
    .catch(err => {
        try{
          this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
        }catch(erorr){
          console.log('Missed Reference');
        };
    });
  }

  getSicknessHistory() {
    ReservationService.getPastIllnessesPatient(this.state.patientId, 4)
    .then(response => {
      this.setState({
        sicknessHistory: response
      })
    })
    .catch(err => {
        try{
          this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
        }catch(erorr){
          console.log('Missed Reference');
        };
    });
  }

  getActiveMedicine(){
    ReservationService.getTakenMedicinePatient(this.state.patientId, 4)
    .then(response => {
      this.setState({
        takenMedicine: response
      });
    })
    .catch(err => {
        try{
          this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
        }catch(erorr){
          console.log('Missed Reference');
        };
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
    if(VisitService.getOpenedVisit() == false){
      if(VisitService.canVisitBeOpened(this.state.id)){
          VisitService.postVisit(this.state.id)
          .then(response => {
            VisitService.startVisit(this.state.id);
            VisitService.setVisitOngoing(this.state.id, true)
            .then(resp => {
              this.setState({
                openedVisit: true
              });
            })
            .catch(err => {
                try{
                  this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
                }catch(erorr){
                  console.log('Missed Reference');
                };
            });
          })
          .catch(err => {
              try{
                this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
              }catch(erorr){
                console.log('Missed Reference');
              };
          });




      }
      else {
        this.state.snackbarRef.current.openSnackBar('Nie mozna otworzyc wizyty', 'red-snackbar');
      }

    }else {
      if(VisitService.getOpenedVisit().id == this.state.id){
        VisitService.putDescriptionOnVisit(this.state.id, this.state.description)
        .then(response => {
          VisitService.setVisitOngoing(this.state.id, false)
          .then(resp => {
            VisitService.endVisit();
            window.location.reload();
          })
          .catch(err => {
              try{
                this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
              }catch(erorr){
                console.log('Missed Reference');
              };
          });


        })
        .catch(err => {
            try{
              this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
            }catch(erorr){
              console.log('Missed Reference');
            };
        });

      }else {
        try{
          this.state.snackbarRef.current.openSnackBar('Wizyta nie jest aktualnie otwartą. Nie można zakończyć.', 'red-snackbar');
        }catch(erorr){
          console.log('Missed Reference');
        };
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

  onClickSelectedSicknessForMedicine(sickness){
  console.log('On selected sicness visit');
  console.log(sickness);
    this.setState(prevState => ({
      clicked:{
        ...prevState.clicked,
        sicknessforMedicine: sickness
      }
    }));
  }



  handleClickAddMedicineDialogBtn(event){

    this.setState ({
      errors: Validation.validateAddMedicineVisit(this.state.clicked.sicknessforMedicine,
        this.state.clicked.medicine, this.state.clicked.descriptionMedicine)
    }, () => {
      if(Object.keys(this.state.errors).length > 0){
        var message = Validation.handleValidationOutcome(this.state.errors);
        this.state.snackbarRef.current.openSnackBar( message ,'red-snackbar');
      }else {
        var medicineVisitObject = {
          id : this.state.clicked.medicine.id,
          illnessId: this.state.clicked.sicknessforMedicine.id,
          startDate: (new Date()).toISOString(),
          endDate: (this.state.clicked.endDate == "" ? "" : new Date(this.state.clicked.endDate).toISOString()),
          description: this.state.clicked.descriptionMedicine,
          visitId: this.state.id,
          patientId: this.state.patientId
        }

        VisitService.postMedicineOnVisit(medicineVisitObject)
        .then(response => {
            this.state.visitMedicine.push({
              illnessHistoryId: medicineVisitObject.illnessId,
              medicineDosage: medicineVisitObject.description,
              medicineId: medicineVisitObject.id,
              medicineName: this.state.clicked.medicine.name,
              startDate: medicineVisitObject.startDate,
              description: this.state.clicked.descriptionMedicine,
            });
            this.setState(prevState  => ({
              ...prevState,
              clear: {
                ...prevState.clear,
                sicknessOnVisit: prevState + 1000,
                medicine: prevState + 2000
              }
              ,
              clicked: {
                ...prevState.clicked,
                medicine: null,
                sicknessforMedicine: null,
                descriptionMedicine: "",
                endDate: ""
              }
            }));
            Dialog.close("medicine-dialog")(event);
        })
        .catch(err => {
            try{
              this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
            }catch(erorr){
              console.log('Missed Reference');
            };
        });
      }
    });



  }

  handleClickAddTreatmentDialogBtn(event){
    this.setState ({
      errors: Validation.validateAddTreatmentVisit(this.state.clicked.treatment, this.state.clicked.descriptionTreatment)
    }, () => {
      if(Object.keys(this.state.errors).length > 0){
        var message = Validation.handleValidationOutcome(this.state.errors);
        this.state.snackbarRef.current.openSnackBar( message ,'red-snackbar');
      }else {
        var treatmentVisitObject = {
          id : this.state.clicked.treatment.id,
          description: this.state.clicked.descriptionTreatment,
          visitId: this.state.id,
          patientId: this.state.patientId
        }
        VisitService.postTreatmentOnVisit(treatmentVisitObject)
        .then(response => {
          Dialog.close("treatment-dialog")(event);
          this.state.visitTreatment.push({
            name: this.state.clicked.treatment.name,
            description: this.state.clicked.descriptionTreatment,
            id: response.id
          });
          this.setState(prevState => ({
            ...prevState,
            clear:{
              ...prevState.clear,
              treatment: prevState - 1
            },
            clicked: {
              ...prevState.clicked,
              treatment: null,
              descriptionTreatment: ""
            }
          }));
        })
        .catch(err => {
            try{
              this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
            }catch(erorr){
              console.log('Missed Reference');
            };
        });
      }
    });


  }

  handleClickAddSicknessDialogBtn(event){
    this.setState ({
      errors: Validation.validateAddSicknessVisit(this.state.clicked.sickness, this.state.clicked.descriptionSickness)
    }, () => {
      if(Object.keys(this.state.errors).length > 0){
        var message = Validation.handleValidationOutcome(this.state.errors);
        this.state.snackbarRef.current.openSnackBar( message ,'red-snackbar');
      }else {
        var sicknessVisitObject = {
          id : this.state.clicked.sickness.id,
          description: this.state.clicked.descriptionSickness,
          visitId: this.state.id,
          patientId: this.state.patientId
        }
        VisitService.postSicknessOnVisit(sicknessVisitObject)
        .then(response => {
          Dialog.close("sickness-dialog")(event);
          this.state.visitSickness.push({
            illnessName: this.state.clicked.sickness.name,
            illnessHistoryId: response.id,
            description: this.state.clicked.descriptionSickness
          });
          this.setState(prevState => ({
            ...prevState,
            clear: {
              ...prevState.clear,
              sickness: prevState + 1
            },
            clicked: {
              ...prevState.clicked,
              sickness: null,
              descriptionSickness: ''
            }
          }));
        })
        .catch(err => {
            try{
              this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
            }catch(erorr){
              console.log('Missed Reference');
            };
        });
      }
    });


  }

  render(){
    return(

      <div className = "VisitPanels">
      <Menu history= {this.props.history}/>
        <div className = {currentUserRole == 'doctor' ? 'visit-summary' : 'visit-summary summary-long'}>

          <div className = "headline-container">
            <b className = "headline">Wizyta nr {this.state.id}</b>
            <RoleButton history= {this.props.history}/>
          </div>
          <div className = 'subheadline-container'>
          <b className = "subheadline">{Formater.formatDate(this.state.startDate)}: </b>
          <a className = "subheadline">{Formater.formatHour(this.state.startDate)} - {Formater.formatHour(this.state.endDate)}</a>
          </div>
          {!this.state.openedVisit ?
          <div className = 'subheadline-container'>
          <b className = "subheadline">Cena: </b>
          <a className = "subheadline">{Formater.formatPrice(this.state.price)}</a>
          </div>
          :
          <div className = 'subheadline-container'>
          <b className = "subheadline">Cena: </b>
          <a className = "subheadline">Dostępna po zakończeniu wizyty</a>
          </div>
          }
          <div className = 'row-container row-container-small'>
          <div className = "active-treatments basic-container">

            <b className = "standard-black">Notatki lekarza (wywiad, badanie, diagnoza, zalecenia)</b>

            <br/>
            {(currentUserRole == 'doctor' && this.state.openedVisit) ?
            <div style = {{width: '100%'}}>
            <TextField
            id="doctor-notes-input"
            label="Notatki"
            placeholder="Zacznij pisać..."
            className = "textField"
            value = {this.state.description}
            onChange = {this.handleChangeDescription}
            multiline
            />
            <button className = 'btn-primary plusSign' onClick = {this.putDescriptionOnVisit}>Zapisz</button>
            </div>
            :
            <a>{this.state.description}</a>
            }
            <br/>


          </div>
          </div>
          <div className = "row-container" style= {{height: '45vh'}}>
          <div className = "flex-column justify-content-space column-container">
            <div className = "basic-container-small basic-container">
              <b className = "standard-black">Zdiagnozowane choroby</b>
              <div className = 'item-holder'>
              {this.state.visitSickness.length > 0 && this.state.visitSickness.map((sickness, index) => (
                <SicknessOnVisitItem
                id = {sickness.illnessHistoryId}
                sicknessName = {sickness.illnessName}
                sicknessDescription = {sickness.description}
                visitId = {this.state.id}
                isOpen = {this.state.openedVisit}
                snackbarCallback = {this.openSnackbarOnRemove}
                />
              ))}
              </div>
              {(currentUserRole == 'doctor' && this.state.openedVisit) ?
              <img src={plusSign}  style = {{width: "40px", cursor: "pointer"}} onClick = {this.handleClickAddSickness} className = 'plusSign'/>
              :
              <div/>
              }
            </div>
            <div className = "basic-container-small basic-container">

              <b className = "standard-black">Zlecone leki</b>
              <div className = 'item-holder'>
              {this.state.visitMedicine && this.state.visitMedicine.map((medicine, index) => (
                <MedicineOnVisitItem
                illnessHistoryId = {medicine.illnessHistoryId}
                medicineId = {medicine.medicineId}
                medicineName = {medicine.medicineName}
                medicineDosage = {medicine.medicineDosage}
                visitId = {this.state.id}
                startDate = {medicine.startDate}
                isOpen = {this.state.openedVisit}
                snackbarCallback = {this.openSnackbarOnRemove}
                />
              ))}
              </div>
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
              <div className = 'item-holder-long'>
              {this.state.visitTreatment && this.state.visitTreatment.map((treatment, index) => (
                <TreatmentOnVisitItem
                treatmentName = {treatment.name}
                treatmentDescription = {treatment.description}
                id = {treatment.id}
                isOpen = {this.state.openedVisit}
                snackbarCallback = {this.openSnackbarOnRemove}
                />
              ))}
              </div>

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
          <b className = "big-white" style={{marginBottom: '15px'}}>{this.state.patientName} {this.state.patientLastname}</b>

          <div className = "medicine-history">
            <a className = "left-margin-small" style={{color: '#E4E4E4', fontWeight: 'bold'}}>Przyjmowane Leki</a>
            <hr style= {{width: '100%'}} />
            {this.state.takenMedicine && this.state.takenMedicine.map((medicine, index ) => (
            <MedicineSmall
              image = {medicine1}
              medicineName = {medicine.medicineName}
              dose = {medicine.medicineDosage}

              />

              ))}
          </div>
          <div className = "medicine-history" style={{marginTop: '15px', height: '42%'}}>

            <a className = "left-margin-small" style={{color: '#E4E4E4', fontWeight: 'bold'}}>Przebyte Choroby</a>
            <hr style= {{width: '100%'}} />
            <div className='overflow-y-auto flex-column' style={{height: '100%'}}>
            {this.state.sicknessHistory && this.state.sicknessHistory.map((illness, index ) => (
              <SicknessSmall
              sickness = {illness}
              id = {illness.illnessHistoryId}
              image = {sicknessSign}
              />

            ))}
            </div>
          </div>
          <div className = 'flex-row' style = {{marginTop: '10px', alignContent: 'flex-end'}}>
            <button className = 'btn-dialog-primary btn-white-filled' onClick = {this.patientHistoryLoadMore}>Zobacz więcej</button>
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
        <Autocomplete
        requestCallback = {VisitService.getSicknessOnVisitSearch}
        changeCallback = {this.onClickSelectedSicknessForMedicine}
        title = "Choroba"
        cssId = 'medicine-search'
        className = 'dialog-margin'
        variant = 'outlined'
        key = {this.state.clear.sicknessOnVisit}
        addId = {this.state.id}
        styles = {{ width: "94%", marginTop: "20px", marginLeft: "20px" }}
        />
        <Autocomplete
        requestCallback = {VisitService.getAvailableMedicine}
        changeCallback = {this.onClickAddMedicine}
        title = "Lek"
        cssId = 'medicine-search'
        variant = 'outlined'
        key = {this.state.clear.medicine}
        className = 'dialog-margin'
        styles = {{ width: "94%", marginTop: "20px", marginLeft: "20px" }}
        />
        <br/>
        <WhiteTextField id="endDate" name="endDate"
        label="Data zakończenia"
        value = {this.state.clicked.endDate}
        onChange = {this.handleChangeMedicineEndDate}
        variant = 'outlined'
        rowsMax = {2}
        type = "date"
        InputLabelProps={{ shrink: true }}
        style = {{marginLeft: '20px', width: '94%'}}
        size="small" fullWidth />
        <br/><br/>
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
        key = {this.state.clear.treatment}
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
        key = {this.state.clear.sickness}
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
      <Snackbar ref = {this.state.snackbarRef} />
      </div>
    );
  }
}

export default VisitDetails;
