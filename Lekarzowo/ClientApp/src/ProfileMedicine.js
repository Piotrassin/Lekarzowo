import React from 'react';
import MedicineItem from './components/MedicineItem.js';
import UserService from './services/UserService.js';
import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';

class ProfileMedicine extends React.Component {
constructor(props){
  super(props);
  this.state = {
    medicines: [],
    loading: false
  };
}

componentDidMount() {
  this.setState({
    loading: true
  });
  UserService.getUserMedicineHistory()
  .then(response => {
    console.log('response: ');
    console.log(response[0]);
    this.setState({
    medicines: response
    });
    this.setState({
      loading: false
    });
  });
}

render() {
  return(
    <div className = 'profile-content-holder flex-column' >
      <a className = 'subheader-content-profile'>Leki Pacjenta</a>
      <a className = 'subheading-content-profile'>Aktualne</a>
      <div className = 'flex-column width-100'>
      <div className = 'sickness-item'>
        <div className = 'sickness-item-part part-1'>
        </div>
        <div className = 'sickness-item-part part-2'>
          <a className = 'table-header'>Lek</a>
        </div>
        <div className = 'sickness-item-part part-3-4'>
          <a className = 'table-header'>Dawka</a>
        </div>
        <div className = 'sickness-item-part part-5'>
          
        </div>
      </div>
{this.state.medicines && this.state.medicines.map((medicine, index ) => (
    <MedicineItem
    medicine={medicine}
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
export default ProfileMedicine;
