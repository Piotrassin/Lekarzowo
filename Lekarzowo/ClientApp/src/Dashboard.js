import React from "react"
import med from './images/medicine_img.png';
import writer from './images/Writer.png';
import bottle from './images/Bottle.png';
import './Main.css';
import {
  Route,
  NavLink,
  HashRouter,
  Redirect
} from "react-router-dom";


class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.getVisits = this.getVisits.bind(this);
  }

  getVisits() {
    return [{
      "date": "26.06.19",
      "time_start": "19:00",
      "time_end": "20:00",
      "doctor_name": "Ross",
      "doctor_surname": "Geller",
      "specialty": "Dinozaurolog"
    },
    {
      "date": "26.06.19",
      "time_start": "19:00",
      "time_end": "20:00",
      "doctor_name": "Ross",
      "doctor_surname": "Geller",
      "specialty": "Dinozaurolog"
    },
    {
      "date": "26.06.19",
      "time_start": "19:00",
      "time_end": "20:00",
      "doctor_name": "Ross",
      "doctor_surname": "Geller",
      "specialty": "Dinozaurolog"
    }

    ];
  }

  handleClickAllVisit() {
    console.log("kliknieto");
  }

  render () {
    var visits = this.getVisits();
    return (
      <div className ="dashboard">
      <div className = "headline-container">
        <b className = "headline">Dr. Adam Adamowski</b>
      </div>
      <div className = "dash-container">
        <div className = "hello-container">
          <img src = {med} className = "medicine-hello" />
          <div className = "hello-txt-container">
          <b className = "big-white">Jak się</b>
          <b className = "huge-white">dzisiaj czujesz ?</b>
          </div>
        </div>
        <div className = "visit-dashboard-container">
          <div className = "visit-dashboard-head">
          <b className = "big-black">Twoje Wizyty</b>
          <a className="menu-item"><NavLink to="/visits">Przejdź</NavLink></a>
          </div>
          <div className = "visits-container">
          {visits.map((visit, index ) => (
            <div className = "visit-item">
              <a className = "small-dash">{visit.date} | {visit.time_start} - {visit.time_end}</a>
              <b className = "standarder-black">{visit.doctor_name} {visit.doctor_surname}</b>
              <a className = "small-black">{visit.specialty}</a>
            </div>
          ))}
          </div>
        </div>
        <div className = "visit-add-action" onClick={this.handleClickAllVisit}>
          <img src = {writer} className = "writer-img" />
          <div className = "flex-column action-txt">
          <b className = "small-white" style = {{marginTop: 5}}>Zapisz się na</b>
          <b className = "big-white" style = {{marginTop: 0}}>Wizytę</b>
          </div>
        </div>
        <div className = "medicine-add-action">
          <img src = {bottle} className = "bottle-img" />
          <div className = "flex-column action-txt">
          <b className = "small-white" style = {{marginTop: 5}}>Zobacz Twoje</b>
          <b className = "big-white" style = {{marginTop: 0}}>Lekarstwa</b>
          </div>
        </div>
        <div className = "chart-container">
        <b className = "big-black">Twój wykres 1</b>
        </div>
        <div className = "chart-container-2">
        <b className = "big-black">Twój wykres 2</b>
        </div>
      </div>
      </div>

    );
  }
}
export default Dashboard;
