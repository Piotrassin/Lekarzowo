import React from 'react';
import doctorIconBig from '../images/DoctorIconBig.svg'
import arrowSign from '../images/ArrowSign.svg'

class DoctorPublicItem extends React.Component {
constructor(props){
  super(props);
  this.state = {
    id: this.props.id
  }
  this.setClickedId = this.setClickedId.bind(this);
}

setClickedId(event) {
  this.props.clickCallback(this.state.id);
}


render(){
  return(

    <div className = "doctor-public-item flex-column" >
      <div className = 'flex-row doctor-public-item-row' >
        <img src = {doctorIconBig}  style = {{width: '30px', marginTop: '10px'}} />
        <a style={{marginLeft: '10px', overflow: 'auto'}}>{this.props.name}</a>

        <button className = 'btn-primary flex-column justify-center' onClick = {this.setClickedId} style={{paddingLeft: '9px', paddingRight: '9px'}}>
          <img src = {arrowSign} className = "addSign" style = {{width: 15, paddingLeft: '0px'}} />
        </button>
      </div>

    </div>
  );
}

}
export default DoctorPublicItem;
