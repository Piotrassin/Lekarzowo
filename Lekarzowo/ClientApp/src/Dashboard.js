import React from "react"
import med from './images/medicine_img.png';
import writer from './images/Writer.png';
import bottle from './images/Bottle.png';
import UserService from './services/UserService.js';
import ReservationService from './services/ReservationService.js';
import AuthService from './authentication/AuthService.js';
import DownArrow from './images/DownArrow.svg';
import './Main.css';
import {
  Route,
  NavLink,
  HashRouter,
  Redirect
} from "react-router-dom";
import RoleButton from './components/RoleButton.js';
import SicknessItem from './components/SicknessItem.js';
import Snackbar from './helpers/Snackbar.js';


const user = AuthService.getUserName();
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
  }
  snackbarRef = React.createRef();

  componentWillMount() {
    ReservationService.getUpcomingReservations(4, 0)
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
        this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
    });

    UserService.getUserSicknessHistory()
    .then(response => {
      this.setState({
      illnesses: response.filter(responseObject => responseObject.curedate == null),
      oldIllnesses: response.filter(responseObject => responseObject.curedate != null)
      });
    })
    .catch(err => {
        this.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
    });
  }

  onClickBtnVisits(event) {
    this.props.history.push('/visits');
  }

  handleClickAddVisit(event){
    this.props.history.push('/addVisit');
  }

  handleClickShowVisit(event){
    this.props.history.push('/myProfile');
  }


  getVisits() {

    return this.state.visit_arr;

  }




  render () {

    return (
      <div className ="dashboard">
      <div className = "headline-container">
        <b className = "headline">{user}</b>
        <RoleButton history= {this.props.history}/>
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
          <a className="button-primary custom-btn" onClick = {this.onClickBtnVisits}>Przejdź</a>
          </div>
          <div className = "visits-container">
          {this.state.visitArray && this.state.visitArray.map((visit, index ) => (
            <div className = "visit-item">
              <b className = "standarder-black">{visit.reservationStartTime.split("T")[0]}</b>
              <a className = "small-dash">{visit.reservationStartTime.split("T")[1]} -
              {visit.reservationEndTime.split("T")[1]}
              </a>
              <a className = "small-dash">{visit.doctorName} {visit.doctorLastname}</a>
              <a className = 'status-info status-info-green'>{visit.doctorSpecialization}</a>
            </div>
          ))}
          </div>
        </div>
        <div className = "visit-add-action" onClick={this.handleClickAddVisit}>
          <img src = {writer} className = "writer-img" style={{width: '40px', marginTop: '5px'}}/>
          <div className = "flex-column action-txt">
          <b className = "small-white" style = {{marginTop: 5}}>Zapisz się na</b>
          <b className = "big-white" style = {{marginTop: 0}}>Wizytę</b>
          </div>
        </div>
        <div className = "medicine-add-action" onClick = {this.handleClickShowVisit}>
          <img src = {bottle} className = "bottle-img" style={{width: '30px', marginTop: '15px'}} />
          <div className = "flex-column action-txt">
          <b className = "small-white" style = {{marginTop: 5}}>Zobacz Twoje</b>
          <b className = "big-white" style = {{marginTop: 0}}>Lekarstwa</b>
          </div>
        </div>
        <div className = "chart-container">
        <b className = "big-black">Aktualne choroby</b>
        <div className = 'flex-column width-100'>
        <div className = 'sickness-item'>
          <div className = 'sickness-item-part part-1'>
          </div>
          <div className = 'sickness-item-part part-2'>
            <a className = 'table-header'>Choroba</a>
          </div>
          <div className = 'sickness-item-part part-3-4'>
            <a className = 'table-header'>Opis</a>
          </div>
          <div className = 'sickness-item-part part-5'>
            <a className = 'table-header'>Akcje</a>
          </div>
        </div>
        <div className = 'overflow-y-auto' style = {{height: "300px"}}>
        {this.state.illnesses && this.state.illnesses.map((illness, index ) => (
            <SicknessItem
            sickness={illness}
            history= {this.props.history}
            />
          ))}
          </div>
        </div>
        </div>

      </div>
      <Snackbar ref = {this.snackbarRef} />
      </div>

    );
  }
}
export default Dashboard;
