import React from "react"
import med from '../images/medicine_img.png';
import writer from '../images/Writer.png';
import bottle from '../images/Bottle.png';
import UserService from '../services/UserService.js';
import VisitService from '../services/VisitService.js';
import ReservationService from '../services/ReservationService.js';
import DoctorService from '../services/DoctorService.js';
import AuthService from '../authentication/AuthService.js';
import DownArrow from '../images/DownArrow.svg';
import '../Main.css';
import {
  Route,
  NavLink,
  HashRouter,
  Redirect
} from "react-router-dom";
import RoleButton from '../components/RoleButton.js';
import SicknessItem from '../components/SicknessItem.js';
import VisitAlert from '../components/VisitAlert.js';
import Menu from '../Menu.js';
import Formater from '../helpers/Formater.js';


const user = AuthService.getUserName();
const userId = AuthService.getUserId();
class Dashboard extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        visitArray: [],
        illnesses:[]
      };
    this.getVisits = this.getVisits.bind(this);
    this.onClickBtnVisits = this.onClickBtnVisits.bind(this);
    this.handleClickAddVisit = this.handleClickAddVisit.bind(this);
    this.handleClickShowVisit = this.handleClickShowVisit.bind(this);
    this.getDoctorWorkingHours = this.getDoctorWorkingHours.bind(this);
  }

  componentWillMount() {
    this.getDoctorWorkingHours();
    var tommorrow = new Date(new Date());
    tommorrow.setDate(tommorrow.getDate());
    ReservationService.getUpcomingDoctorReservations(new Date(), tommorrow)
    .then(response => {
      if(response.status == 401){
        AuthService.logout();
        this.props.history.push('/login');
        window.location.reload();
        return '';
      }
      return response;
    })
    .then(response => {
      this.setState({
        visitArray: response
      })
    })
    .catch(err => {
      if(err.message == 401){
        AuthService.logout();
        this.props.history.push('/login');
        window.location.reload();

      }
    });

    UserService.getUserSicknessHistory()
    .then(response => {
      this.setState({
      illnesses: response.filter(responseObject => responseObject.curedate == null),
      oldIllnesses: response.filter(responseObject => responseObject.curedate != null)
      });
    })
    .catch(err => {
        try{
          this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
        }catch(erorr){
          console.log('Missed Reference');
        };
    });

  }

  getDoctorWorkingHours(){
    DoctorService.getDoctorWorkingHours(userId, 7)
    .then(response => {
      this.setState({
        doctorWorkingHoursArray: response
      });
    })
    .catch(err => {
        try{
          this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
        }catch(erorr){
          console.log('Missed Reference');
        };
    });
  }

  onClickBtnVisits(event) {
    this.props.history.push('/visits');
  }

  handleClickAddVisit(event){
    this.props.history.push('/visits');
  }

  handleClickShowVisit(event){
    this.props.history.push('/findDoctor');
  }


  getVisits() {

    return this.state.visit_arr;

  }

  render () {

    return (
      <div className = 'container'>
      <Menu history= {this.props.history}/>
      <div className ="dashboard">
      <div className = "headline-container">
        <b className = "headline">{user}</b>
        <RoleButton history= {this.props.history}/>
      </div>
      <div className = "dash-container">
        <div className = "hello-container">
          <img src = {med} className = "medicine-hello" />
          <div className = "hello-txt-container">
          <b className = "big-white">Gotowy na</b>
          <b className = "huge-white">kolejny dzień ?</b>
          </div>
        </div>
        <div className = "visit-dashboard-container">
          <div className = "visit-dashboard-head">
          <b className = "big-black">Dzisiejsze Wizyty</b>
          <a className="button-primary custom-btn" onClick = {this.onClickBtnVisits}>Przejdź</a>
          </div>
          <div className = "visits-container overflow-y-auto" style = {{height: '250px'}}>
          {this.state.visitArray.length > 0 && this.state.visitArray.map((visit, index ) => (
            <div className = "visit-item">
              <b className = "standarder-black">{visit.reservationStartTime.split("T")[0]}</b>
              <a className = "small-dash">{visit.reservationStartTime.split("T")[1]} -
              {visit.reservationEndTime.split("T")[1]}
              </a>
              <a className = "small-dash">{visit.patientName} {visit.patientLastname}</a>
              <a className = 'status-info status-info-green'>{visit.doctorSpecialization}</a>
            </div>
          ))}
          </div>
        </div>
        <div className = "visit-add-action" onClick={this.handleClickAddVisit}>
          <img src = {writer} className = "writer-img" style={{width: '40px', marginTop: '5px'}}/>
          <div className = "flex-column action-txt">
          <b className = "small-white" style = {{marginTop: 5}}>Twoje</b>
          <b className = "big-white" style = {{marginTop: 0}}>Wizyty</b>
          </div>
        </div>
        <div className = "medicine-add-action" onClick = {this.handleClickShowVisit}>
          <img src = {bottle} className = "bottle-img" style={{width: '30px', marginTop: '15px'}} />
          <div className = "flex-column action-txt">
          <b className = "small-white" style = {{marginTop: 5}}>Wyszukaj</b>
          <b className = "big-white" style = {{marginTop: 0}}>Grafik Lekarzy</b>
          </div>
        </div>
        <div className = "chart-container">
        <b className = "big-black">Twoje godziny pracy</b>
        <br/><br/>
        <div className = 'workinghours-container'>
        {this.state.doctorWorkingHoursArray && this.state.doctorWorkingHoursArray.map((local, index ) => (
        <div>
          <a className = 'subheading-content-profile'>{local.name} ({local.streetname} {local.streetnumber})</a>
          <hr style = {{width: '100%'}}/>
          {local.workinghours.map((workinghours, index) =>
          <div className = 'profile-data-slot' style = {{width: '300px', color: 'black'}}>
            <a className = 'profile-data-slot-header' style = {{color: 'black'}}>{Formater.getDayofWeek(workinghours.from)}</a><a>{Formater.formatHour(workinghours.from)} -
            {Formater.formatHour(workinghours.to)}</a>
          </div>
          )}

        </div>
        ))}
        </div>
        </div>

      </div>
      </div>
      <VisitAlert history= {this.props.history}/>
</div>
    );
  }
}
export default Dashboard;
