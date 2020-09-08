import React from "react"
import './Main.css';
import womanAvatar from './images/womanAvatar.jpg';
import medicine1 from './images/medicine1.png';
import MedicineSmall from './MedicineSmall';
import MedicineBigger from './MedicineBigger';
import TreatmenrSmall from './TreatmenrSmall';
import SicknessSmall from './SicknessSmall';

class VisitDetails extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      medicineHistory: [],
      sicknessHistory: [],
      treatmentHistory: [],
      name: "",
      surname: "",
      reservationId: ""
    }
    this.getMedicineHistory = this.getMedicineHistory.bind(this);
    this.getSicknessHistory = this.getSicknessHistory.bind(this);
    this.getTreatmentHistory = this.getTreatmentHistory.bind(this);
  }
  componentDidMount() {
      fetch('https://localhost:44360/api/visits/details/' + this.props.id)
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
        .catch(err => console.log(err));
  }

  getMedicineHistory() {
    /*return [
      {name: "Xanax",dose: "2 x dzienne"},
      {name: "Ibufen",dose: "1 x dzienne"}
    ];*/

    return this.state.medicineHistory.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name && t.dose===v.dose && t.medicineHistoryDescription===v.medicineHistoryDescription))===i);

  }
  getSicknessHistory() {
    /*return [
      {name: "Padaczka",startDate: "20-10-1997", endDate: "teraz"},
      {name: "Padaczka",startDate: "20-10-1997", endDate: "teraz"},
      {name: "Padaczka",startDate: "20-10-1997", endDate: "teraz"}
    ];*/
    return this.state.sicknessHistory.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name && t.startDate===v.startDate && t.endDate===v.endDate))===i);
  }

  getTreatmentHistory() {
    return this.state.treatmentHistory.filter((v,i,a)=>a.findIndex(t=>(t.treatmentName === v.treatmentName && t.treatmentOnVisitDescription===v.treatmentOnVisitDescription))===i);
  }

  render(){
    var medicines = this.getMedicineHistory();
    var sicknesses = this.getSicknessHistory();
    var treatments = this.getTreatmentHistory();
    return(
      <div className = "VisitPanels">
        <div className = "visit-summary">
          <div className = "headline-container">
            <b className = "headline">Wizyta nr {this.state.reservationId}</b>
            <b className = "subheadline">17:15 - 20:20</b>
          </div>
          <div className = "row-container">
            <div className = "actions-container">
              <div className = "basic-container add-medicine"></div>
              <div className = "basic-container add-treatment"></div>
              <div className = "basic-container add-treatment"></div>
              <div className = "basic-container end"></div>
            </div>
            <div className = "active-medicine basic-container">
              <br/>
              <b className = "standard-black">Przepisane Leki</b>
              <div className = "med-container">
                {medicines.map((medicine, index ) => (
                  <MedicineBigger
                    image = {medicine1}
                    medicineName = {medicine.name}
                    dose = {medicine.dose}
                    medicineHistoryDescription = {medicine.medicineHistoryDescription}
                    />
                ))}
              </div>
            </div>
          </div>
          <div className = "active-treatments basic-container">
          <br/>
            <b className = "standard-black">Wykonane Zabiegi</b>
            <div className = "treatment-container">
            {treatments.map((treatment, index ) => (
              <TreatmenrSmall
              treatmentName = {treatment.treatmentName}
              treatmentOnVisitDescription = {treatment.treatmentOnVisitDescription}
              />
              ))}
            </div>
          </div>

        </div>
        <div className = "visit-member">
          <b className = "standard-dashed">Profil Pacjenta</b>
          <b className = "big-white">{this.state.name} {this.state.surname}</b>
          <img src={womanAvatar} alt="Avatar" className = "avatar"/>
          <div className = "medicine-history">
            <b className = "standard-dashed left-margin-small">Przyjmowane Leki</b>
            {medicines.map((medicine, index ) => (
            <MedicineSmall
              image = {medicine1}
              medicineName = {medicine.name}
              dose = {medicine.dose}

              />
              ))}
          </div>
          <div className = "medicine-history">
            <b className = "standard-dashed left-margin-small">Przebyte Choroby</b>
            {sicknesses.map((sickness, index ) => (
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
