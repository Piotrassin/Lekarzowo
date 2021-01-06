import React from 'react';
import MedicineItem from './components/MedicineItem.js';
import UserService from './services/UserService.js';
import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from './helpers/Snackbar.js';

class ProfileMedicine extends React.Component {
constructor(props){
  super(props);
  this.state = {
    medicines: [],
    loading: false,
    snackbarRef: null
  };
}


componentDidMount() {
  this.setState({
    loading: true,
    snackbarRef: React.createRef()
  }, () => {
    UserService.getUserMedicineHistory()
    .then(response => {
      this.setState({
      medicines: response,
      loading: false
      });
    })
    .catch(err => {
        try{
          this.state.snackbarRef.current.openSnackBar(err.message, 'red-snackbar');
        }catch(erorr){
          console.log('Missed Reference');
        };
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
            <a className = 'table-header'>Stosowanie</a>
          </div>

          <div className = 'sickness-item-part part-5'>
            <a className = 'table-header'>Okres przyjmowania</a>
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
        <Fade in={this.state.loading} unmountOnExit>
          <LinearProgress />
        </Fade>
      </div>
      <Snackbar ref = {this.state.snackbarRef} />
    </div>
  );
}

}
export default ProfileMedicine;
