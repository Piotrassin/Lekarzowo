import React from "react"
import med from './images/medicine_img.png';
import writer from './images/Writer.png';
import bottle from './images/Bottle.png';
import UserService from './services/UserService.js'
import AuthService from './authentication/AuthService.js'
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
      this.state = {
        visit_arr: []
      };
    this.getVisits = this.getVisits.bind(this);
  }

  componentDidMount() {
    //console.log("User " + AuthService.getLoggedUser());
    UserService.getDashboardContent()
    .then(response => {
      if(response.status == 401){
        this.props.history.push('/');
      }
      return response.json();
    })
.then(response => console.log(response));
  /*  fetch('https://localhost:5001/api/Visits/List')
        .then(response => response.json())
        .then(dataMine =>
          this.setState({ visit_arr: dataMine })
          //console.log(dataMine)
        )
        .catch(err => console.log(err));
*/
  }


  getVisits() {

    return this.state.visit_arr;
    /*return [{
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

  ];*/
  }



  handleClickAllVisit() {
    console.log("kliknieto");
  }

  render () {
    var visits = this.getVisits();
    const user = JSON.parse(localStorage.getItem("userData"));
    return (
      <div className ="dashboard">
      <div className = "headline-container">
        <b className = "headline"></b>
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
          <a className="button-primary custom-btn"><NavLink to="/visits">Przejdź</NavLink></a>
          </div>
          <div className = "visits-container">
          {visits.map((visit, index ) => (
            <div className = "visit-item">
              <a className = "small-dash">{visit.reservationStartTime.split("T")[0]}</a>
              <b className = "standarder-black">{visit.doctorName} {visit.doctorLastname}</b>
              <a className = "small-black">{visit.specialityName}</a>
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
        <br/>
        <b className = "big-black">Twój wykres 1</b>
        </div>
        <div className = "chart-container-2">
        <br/>
        <b className = "big-black">Twój wykres 2</b>
        </div>
      </div>
      </div>

    );
  }
}
export default Dashboard;
