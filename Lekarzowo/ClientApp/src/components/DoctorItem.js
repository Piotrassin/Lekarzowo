import React from 'react';
import doctorIconBig from '../images/DoctorIconBig.svg'

class DoctorItem extends React.Component {
constructor(props){
  super(props);
  this.state = {

  }
}



render(){
  return(

    <div className = "doctor-item" >
      <img src = {doctorIconBig}  style = {{width: '80px', marginTop: '10px'}} />
      <br/>
      <a >{this.props.name}</a>
      <br/>
      <button className = 'btn-primary' onClick = {this.props.clickCallback}>Wybierz</button>
    </div>
  );
}

}
export default DoctorItem;
