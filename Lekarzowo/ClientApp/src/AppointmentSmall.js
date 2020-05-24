import React from "react"
import './Main.css';

class AppontmentSmall extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className = "appointment">
        <a>{this.props.name} {this.props.surname}</a>
        <b>{this.props.specialty}</b>
      </div>
    );
  }
}

export default AppontmentSmall
