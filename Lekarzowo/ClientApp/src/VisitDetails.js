import React from "react"
import './Main.css';
import womanAvatar from './images/womanAvatar.jpg';
import medicine1 from './images/medicine1.png';
import MedicineSmall from './MedicineSmall';
import { withStyles } from '@material-ui/core/styles';
import MedicineBigger from './MedicineBigger';
import TreatmenrSmall from './TreatmenrSmall';
import SicknessSmall from './SicknessSmall';
import Menu from './Menu.js';
import TextField from '@material-ui/core/TextField';
import UserService from './services/UserService.js';
import ReservationService from './services/ReservationService.js';
import AuthService from './authentication/AuthService';

class VisitDetails extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      id: window.location.href.split('visit/')[1],
      patientId: JSON.parse(AuthService.getLoggedUser()).id,
      medicineHistory: [],
      sicknessHistory: [],
      treatmentHistory: [],
      takenMedicine: [],
      name: "",
      surname: "",
      reservationId: "",
      description: ""
    }
    this.getMedicineHistory = this.getMedicineHistory.bind(this);
    this.getSicknessHistory = this.getSicknessHistory.bind(this);
    this.getTreatmentHistory = this.getTreatmentHistory.bind(this);
    this.getActiveMedicine = this.getActiveMedicine.bind(this);
    this.getVisit = this.getVisit.bind(this);
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
    UserService.getUserSicknessHistory(this.state.patientId)
    .then(response => {
      this.setState({
        sicknessHistory: response[0].illnesses
      })
    });

  }

  getActiveMedicine(){
    ReservationService.getTakenMedicine()
    .then(response => {
      this.setState({
        takenMedicine: response
      });
    });
  }

  getTreatmentHistory() {
    return this.state.treatmentHistory.filter((v,i,a)=>a.findIndex(t=>(t.treatmentName === v.treatmentName && t.treatmentOnVisitDescription===v.treatmentOnVisitDescription))===i);
  }

  render(){
    var sicknesses = this.state.sicknessHistory;
    var medicines = this.getMedicineHistory()
    var treatments = this.getTreatmentHistory();
    return(

      <div className = "VisitPanels">
      <Menu history= {this.props.history}/>
        <div className = "visit-summary">

          <div className = "headline-container">
            <b className = "headline">Wizyta nr {this.state.id}</b>
            <b className = "subheadline">17:15 - 20:20</b>
          </div>
          <div className = "active-treatments basic-container">

            <b className = "standard-black">Notatki lekarza (wywiad, badanie, diagnoza, zalecenia)</b>
            <TextField
            id="doctor-notes-input"
            label="Notatki"
            placeholder="Zacznij pisać..."
            className = "textField"
            multiline
            />
            <br/>
            <a>{this.state.description}</a>

          </div>
          <div className = "row-container">
          <div className = "flex-column justify-content-space column-container">
            <div className = "basic-container-small basic-container">

              <b className = "standard-black">Wystawione skierowania</b>
            </div>
            <div className = "basic-container-small basic-container">

              <b className = "standard-black">Zlecone leki</b>
            </div>
          </div>
            <div className = "active-medicine basic-container">

              <b className = "standard-black">Wykonane zabiegi</b>
              <div className = "med-container">
                {medicines && medicines.map((medicine, index ) => (
                  <MedicineSmall
                    image = {medicine1}
                    medicineName = {medicine.name}
                    dose = {medicine.dose}
                    medicineHistoryDescription = {medicine.medicineHistoryDescription}
                    />
                ))}
              </div>

            </div>


          </div>
          <button className = "btn-end-visit">Zakończ wizytę</button>

        </div>
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
            {sicknesses && sicknesses.map((sickness, index ) => (
              <SicknessSmall
              sicknessName = {sickness.name}
              dateStart = {sickness.startDate.split("T")[0]}
              dateEnd = {sickness.endDate.split("T")[0]}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default VisitDetails;
