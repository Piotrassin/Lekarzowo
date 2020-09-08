import React from "react"
import RedirectButton from "./RedirectButton";
import './Main.css';

class AppontmentSmall extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className = {this.props.class}>
        <a>{this.props.name} {this.props.surname}</a>
            <b>{this.props.specialty}</b>
            <RedirectButton

                id={this.props.index}
                redirectTo={"/visit/" + this.props.index}
                buttonStyle="button-primary"
                text="Przejdź"
            />
      </div>
    );
  }
}

export default AppontmentSmall
