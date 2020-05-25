import React from "react"
import './Main.css';
import womanAvatar from './images/womanAvatar.jpg';
import medicine1 from './images/medicine1.png';
import MedicineSmall from './MedicineSmall';
import SicknessSmall from './SicknessSmall';

class VisitDetails extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      medicineHistory: [],
      sicknessHistory: []
    }
    this.getMedicineHistory = this.getMedicineHistory.bind(this);
    this.getSicknessHistory = this.getSicknessHistory.bind(this);
  }
  componentDidMount() {
    fetch('https://localhost:5001/api/visits/details')
        .then(response => response.json())
        .then(dataMine =>
          this.setState({ medicineHistory: dataMine.map(item => {
            var med_arr = item.medicineName.split(" ");
            return {name: med_arr[0], dose: med_arr[1]};
          }),
        sicknessHistory:  dataMine.map(item => {

          return {name: item.illnessName, startDate: item.medicineHistoryStartDate, endDate:  item.medicineHistoryEndDate};
        }) })
          //console.log(dataMine)
        )
        .catch(err => console.log(err));
  }

  getMedicineHistory() {
    /*return [
      {name: "Xanax",dose: "2 x dzienne"},
      {name: "Ibufen",dose: "1 x dzienne"}
    ];*/

    return this.state.medicineHistory.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name && t.dose===v.dose))===i);

  }
  getSicknessHistory() {
    /*return [
      {name: "Padaczka",startDate: "20-10-1997", endDate: "teraz"},
      {name: "Padaczka",startDate: "20-10-1997", endDate: "teraz"},
      {name: "Padaczka",startDate: "20-10-1997", endDate: "teraz"}
    ];*/
    return this.state.sicknessHistory.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name && t.startDate===v.startDate && t.endDate===v.endDate))===i);
  }

  render(){
    var medicines = this.getMedicineHistory();
    var sicknesses = this.getSicknessHistory();
    return(
      <div className = "VisitPanels">
        <div className = "visit-summary">
          <div className = "headline-container">
            <b className = "headline">Wizyta nr 13425</b>
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
            </div>
          </div>
          <div className = "active-treatments basic-container">
          <br/>
            <b className = "standard-black">Wykonane Zabiegi</b>
          </div>

        </div>
        <div className = "visit-member">
          <b className = "standard-dashed">Profil Pacjenta</b>
          <b className = "big-white">Anna Annowska</b>
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
              dateStart = {sickness.startDate}
              dateEnd = {sickness.endDate}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default VisitDetails;
