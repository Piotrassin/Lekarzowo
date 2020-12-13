import React from 'react';
import SicknessItem from './components/SicknessItem.js';
import UserService from './services/UserService.js';
import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';

class ProfileSickness extends React.Component {
constructor(props){
  super(props);
  this.state = {
    illnesses: [],
    oldIllnesses: [],
    loading: false
  };
}

componentDidMount() {
  this.setState({
    loading: true
  });
  UserService.getUserSicknessHistory()
  .then(response => {
    this.setState({
    illnesses: response.filter(responseObject => responseObject.curedate == null),
    oldIllnesses: response.filter(responseObject => responseObject.curedate != null)
    });
    this.setState({
      loading: false
    });
  });
}

render() {
  return(
    <div className = 'profile-content-holder flex-column' >
      <a className = 'subheader-content-profile'>Choroby Pacjenta</a>
      <a className = 'subheading-content-profile'>Aktualne</a>
      <div className = 'flex-column width-100'>
      <div className = 'sickness-item'>
        <div className = 'sickness-item-part part-1'>
        </div>
        <div className = 'sickness-item-part part-2'>
          <a className = 'table-header'>Choroba</a>
        </div>
        <div className = 'sickness-item-part part-3'>
          <a className = 'table-header'>Zdiagnozowano</a>
        </div>
        <div className = 'sickness-item-part part-4'>
          <a className = 'table-header'>Wyleczono</a>
        </div>
        <div className = 'sickness-item-part part-5'>
          <a className = 'table-header'>Akcje</a>
        </div>
      </div>
{this.state.illnesses && this.state.illnesses.map((illness, index ) => (
    <SicknessItem
    sickness={illness}
    />
  ))}

      </div>
      <a className = 'subheading-content-profile'>Przebyte</a>
      <div className = 'flex-column width-100'>
      <div className = 'sickness-item'>
        <div className = 'sickness-item-part part-1'>
        </div>
        <div className = 'sickness-item-part part-2'>
          <a className = 'table-header'>Choroba</a>
        </div>
        <div className = 'sickness-item-part part-3'>
          <a className = 'table-header'>Zdiagnozowano</a>
        </div>
        <div className = 'sickness-item-part part-4'>
          <a className = 'table-header'>Wyleczono</a>
        </div>
        <div className = 'sickness-item-part part-5'>
          <a className = 'table-header'>Akcje</a>
        </div>
      </div>
      {this.state.oldIllnesses && this.state.oldIllnesses.map((illness, index ) => (
          <SicknessItem
          sickness={illness}
          />
        ))}
      </div>
      <br/>
      <div className='progress-holder'>
        <Fade
          in={this.state.loading}
          unmountOnExit
        >
          <LinearProgress />
          </Fade>
        </div>
    </div>
  );
}

}
export default ProfileSickness;
