import React from 'react';
import Dashboard from './Dashboard'
import Menu from './Menu.js';
import { withStyles } from '@material-ui/core/styles';
import DateStepper from './DateStepper'
import VisitItem from './components/VisitItem.js';
import Switch from '@material-ui/core/Switch';
import ReservationService from './services/ReservationService.js';
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
  checked: {},
  track: {},
})(Switch);
class Visits extends React.Component {
  constructor(props){
    super(props);
    this.onCheckVisitType = this.onCheckVisitType.bind(this);
    this.state = {
      checkedVisit: true,
      upcomingVisits: [],
      recentVisits: []
    };
  }

  async componentDidMount() {
    await ReservationService.getUpcomingReservations(10,0)
    .then(response => {
      this.setState({
        upcomingVisits: response
      });
    });
  }

  async getPreviousVisit() {
    await ReservationService.getRecentReservations(10, 0)
    .then(response => {
      this.setState({
        recentVisits: response
      });
    });
  }

  async getUppcomingVisit() {
    await ReservationService.getUpcomingReservations(10, 0)
    .then(response => {
      this.setState({
        upcomingVisits: response
      });
    });
  }



  onCheckVisitType(event) {
    this.setState({
      checkedVisit: event.target.checked
    });
    if(this.state.checkedVisit){
      this.getUppcomingVisit();
    }else {
      this.getPreviousVisit();
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
                  <a className = 'table-header'>Lekarz</a>
                </div>
                <div className = 'sickness-item-part part-5'>
                </div>
              </div>
              {this.state.checkedVisit && this.state.upcomingVisits.map((visit, index ) => (
                  <VisitItem
                  visit={visit}
                  history= {this.props.history}
                  />
                ))}
                {(!this.state.checkedVisit) && this.state.recentVisits.map((visit, index ) => (
                    <VisitItem
                    visit={visit}
                    history= {this.props.history}
                    />
                  ))}

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
        </div>
      );
  }
}

export default Visits;
