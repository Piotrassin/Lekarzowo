import React from 'react';
import Dashboard from './Dashboard'
import Menu from './Menu.js';
import { withStyles } from '@material-ui/core/styles';
import { Dialog } from './components/Dialog.js';
import DateStepper from './DateStepper'
import VisitItem from './components/VisitItem.js';
import Switch from '@material-ui/core/Switch';
import ReservationService from './services/ReservationService.js';
import VisitService from './services/VisitService.js';
import AuthService from './authentication/AuthService';
import VisitAlert from './components/VisitAlert.js';
import Formater from './helpers/Formater.js';
import Snackbar from './helpers/Snackbar.js';
const PurpleSwitch = withStyles({
  switchBase: {
    color: '#DBD887',
    '&$checked': {
      color: '#C1A305',
    },
    '&$checked + $track': {
      backgroundColor: '#C1A305',
    },
  },
  checked: true,
  track: {},
})(Switch);

const currentRole = AuthService.getUserCurrentRole();

class Visits extends React.Component {
  constructor(props){
    super(props);
    this.onCheckVisitType = this.onCheckVisitType.bind(this);
    this.openConfirmCancelReservationDialog = this.openConfirmCancelReservationDialog.bind(this);
    this.cancelVisit = this.cancelVisit.bind(this);
    this.onClickLoadMore = this.onClickLoadMore.bind(this);
    this.state = {
      snackbarRef: null,
      checkedVisit: true,
      upcomingVisits: [],
      recentVisits: [],
      visitToCancel: {},
      daysVisitCountBefore: 7,
      daysVisitCountAfter: 2,
      limitBefore:  10,
      limitAfter: 10,
      showButton: true
    };
  }


  async componentDidMount() {
    this.setState({
      snackbarRef: React.createRef()
    }, () => {
        this.getUppcomingVisit();
    });

  }

  async getPreviousVisit() {
    var daysBefore = new Date(new Date());
    daysBefore.setDate(daysBefore.getDate() - this.state.daysVisitCountBefore);
    var daysAfter = new Date(new Date());
    daysAfter.setDate(daysAfter.getDate() + 2);

    if(currentRole == 'doctor'){
      return await ReservationService.getRecentDoctorReservations(daysBefore , daysAfter)
      .then(response => {
        this.setState({
          recentVisits: response
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
    else if (currentRole == 'patient'){
      return await ReservationService.getRecentReservations(10, 0)
      .then(response => {
        this.setState({
          recentVisits: response
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

  }

  async getPreviousVisitLoadMore() {
    var daysBefore = new Date(new Date());
    daysBefore.setDate(daysBefore.getDate() - this.state.daysVisitCountBefore - 7);
    var daysAfter = new Date(new Date());
    daysAfter.setDate(daysAfter.getDate() - this.state.daysVisitCountBefore);

    if(currentRole == 'doctor'){

      return await ReservationService.getRecentDoctorReservations(daysBefore , daysAfter)
      .then(response => {
        this.setState({
          recentVisits: (this.state.recentVisits).concat(response),
          daysVisitCountBefore: this.state.daysVisitCountBefore - 7
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
    else if (currentRole == 'patient'){
      return await ReservationService.getRecentReservations(10, this.state.limitBefore)
      .then(response => {
        if(response.length == 0 ){
          this.setState({
            showButton: false
          });
        }
        else {
          this.setState({
            recentVisits: (this.state.recentVisits).concat(response),
            limitBefore: this.state.limitBefore + 10
          });
        }
      })
      .catch(err => {
          try{
            this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
          }catch(erorr){
            console.log('Missed Reference');
          };
      });
    }

  }

  async getUppcomingVisit() {
    if(currentRole == 'doctor' ){
      var daysBefore = new Date(new Date());
      daysBefore.setDate(daysBefore.getDate());
      var daysAfter = new Date(new Date());
      daysAfter.setDate(daysAfter.getDate() + 7);

      return await ReservationService.getUpcomingDoctorReservations(daysBefore, daysAfter)
      .then(response => {
        this.setState({
          upcomingVisits: response
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
    else if(currentRole == 'patient') {

      await ReservationService.getUpcomingReservations(10, 0)
      .then(response => {
        this.setState({
          upcomingVisits: response
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

  }

  async getUppcomingVisitLoadMore() {
    if(currentRole == 'doctor' ){
      var daysBefore = new Date(new Date());
      daysBefore.setDate(daysBefore.getDate() - this.state.daysVisitCountAfter);
      var daysAfter = new Date(new Date());
      daysAfter.setDate(daysAfter.getDate() - this.state.daysVisitCountAfter + 7);
      return await ReservationService.getUpcomingDoctorReservations(daysBefore, daysAfter)
      .then(response => {
        this.setState({
          upcomingVisits: (this.state.upcomingVisits).concat(response),
          daysVisitCountAfter: this.state.daysVisitCountAfter + 7
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
    else if(currentRole == 'patient') {
      await ReservationService.getUpcomingReservations(10, this.state.limitAfter)
      .then(response => {
        if(response.length == 0 ){
          this.setState({
            showButton: false
          });
        }else {
          this.setState({
            upcomingVisits: (this.state.upcomingVisit).concat(response),
            limitAfter: this.state.limitAfter + 10
          });
        }

      })
      .catch(err => {
          try{
            this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
          }catch(erorr){
            console.log('Missed Reference');
          };
      });
    }

  }

  onClickLoadMore(event){
    if(this.state.checkedVisit){
      this.getUppcomingVisitLoadMore();
    }else {
      this.getPreviousVisitLoadMore();
    }
  }


  onCheckVisitType(event) {
    console.log(event.target.checked);
    this.setState({
      checkedVisit: event.target.checked,
      showButton: true
    }, () => {
      if(this.state.checkedVisit){
        this.getUppcomingVisit();
      }else {
        this.getPreviousVisit();
      }
    });
  }

  openConfirmCancelReservationDialog(visitItem, event){

    console.log(visitItem);
    this.setState({
      visitToCancel: visitItem
    }, () => {
      if(!(Object.keys(this.state.visitToCancel).length === 0)){
        console.log(this.state.visitToCancel);
        Dialog.open("visit-cancel-dialog")(event);
      }
    });
  }

  cancelVisit(event) {
    if(!(Object.keys(this.state.visitToCancel).length === 0)){
      console.log('helo');
      ReservationService.cancelReservation(this.state.visitToCancel.reservationId)
      .then(response => {
        this.state.snackbarRef.current.openSnackBar('Odwołano wizytę', 'green-snackbar');
        Dialog.close("visit-cancel-dialog")(event);
        this.setState({
          visitToCancel: {}
        });
        window.location.reload()
      })
      .catch(err => {
          try{
            this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
          }catch(erorr){
            console.log('Missed Reference');
          };
      });
    }
  }

  render() {
      return(
        <div className = 'container'>
        <Menu history= {this.props.history}/>
          <div className = 'visits-page-container'>
          <div className = 'visits-content-holder flex-column'>
            <a className = 'subheader-content-profile'>Twoje wizyty</a>

            {this.state.checkedVisit ?
          <a className = 'subheading-content-profile'>Nadchodzące</a>
            :
            <a className = 'subheading-content-profile'>Poprzednie</a>
          }

            <div className = 'flex-column width-100'>
              <div className = 'sickness-item'>
                <div className = 'sickness-item-part part-1'>
                  <a className = 'table-header'>Data</a>
                </div>
                <div className = 'sickness-item-part part-2'>
                  <a className = 'table-header'>Godziny</a>
                </div>
                <div className = 'sickness-item-part part-3'>
                  <a className = 'table-header'>Miejsce</a>
                </div>
                <div className = 'sickness-item-part part-4'>
                  <a className = 'table-header'>{currentRole == 'doctor' ? 'Pacjent' : 'Lekarz'}</a>
                </div>
                <div className = 'sickness-item-part part-5'>
                </div>
              </div>
              <div className = 'overflow-y-auto' style = {{height: '70vh'}}>
              {this.state.checkedVisit && this.state.upcomingVisits.map((visit, index ) => (
                  <VisitItem
                  visit={visit}
                  role={currentRole}
                  history= {this.props.history}
                  dialogCallback = {this.openConfirmCancelReservationDialog}
                  upcomingVisit = {true}
                  />
                ))}
                {(!this.state.checkedVisit) && this.state.recentVisits.map((visit, index ) => (
                    <VisitItem
                    visit={visit}
                    role={currentRole}
                    history= {this.props.history}
                    upcomingVisit = {false}
                    />
                  ))}
</div>
{this.state.showButton ?
<div className = 'flex-row justify-center' style={{marginTop: '20px'}}>
  <button className = "btn-success-arrow" onClick = {this.onClickLoadMore}>
{this.state.checkedVisit ?
  'Załaduj wizyty z kolejnych dni'
  :
  'Załaduj wizyty z poprzednich dni'
}</button>
</div>
:
<div/>
}
            </div>

          </div>
          <div className = 'filter-pane flex-column'>

              <a className = 'subheader-content-white'>Filtrowanie</a>
              <div>
              <a>Przeszłe</a>
              <PurpleSwitch
                checked={this.state.checkedVisit}
                onChange = {this.onCheckVisitType}
                name="checkedB"
                color="primary"
                />
              <a>Nadchodzące</a>
              </div>


          </div>
          </div>
          <VisitAlert history= {this.props.history}/>
          {this.state.visitToCancel ?
          <Dialog id = "visit-cancel-dialog">
            <div className = "header-dialog">Odwołaj Rezerwację</div>
            <div className = 'padding-small'>
            <div className = 'subheader-profile'>
            <a>Wizyta</a>
            <hr/>
            </div>

            {currentRole == 'patient' ?
            <div className = 'profile-data-slot'>
            <a className = 'profile-data-slot-header'>Lekarz</a><a>{this.state.visitToCancel.doctorName} {this.state.visitToCancel.doctorLastname}</a>
            </div>
            :
            <div className = 'profile-data-slot'>
            <a className = 'profile-data-slot-header'>Pacjent</a><a>{this.state.visitToCancel.patientName} {this.state.visitToCancel.patientLastname}</a>
            </div>
            }

            <div className = 'profile-data-slot'>
            <a className = 'profile-data-slot-header'>Data</a><a>{Formater.formatDate(this.state.visitToCancel.reservationStartTime)}</a>
            </div>
            <div className = 'profile-data-slot'>
            <a className = 'profile-data-slot-header'>Godziny</a><a>{Formater.formatHour(this.state.visitToCancel.reservationStartTime)} -
            {Formater.formatHour(this.state.visitToCancel.reservationEndTime)}</a>
            </div>
            </div>
            <div className = "dialog-btn-hold">
              <button className = "btn-primary" style = {{marginRight: '20px'}} onClick = {this.cancelVisit}>Potwierdź</button>
            </div>
          </Dialog>
          :
          <div/>
        }
        <Snackbar ref = {this.state.snackbarRef} />
        </div>
      );
  }
}

export default Visits;
