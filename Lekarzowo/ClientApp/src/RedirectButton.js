import React, { Component } from "react";
//import registrationStyles from "./css/RegisterStyles.css"
//import styles from "./css/styles.css"
//import ReservationItem from "./ReservationItem";
import {
  withRouter,
  Redirect
} from 'react-router-dom';

class RedirectButton extends Component {

  constructor(props){
    super(props);
    this.state = {
      key: this.props.id,
      redirectTo: this.props.redirectTo,
      buttonStyle: this.props.buttonStyle,
      redirect: false
    };
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={{
            pathname: this.state.redirectTo,
            state: {dataEdit: this.state.key}
        }} />
    }
  }

  render() {
    const { data } = this.state;
    return (
      <div style={{display: this.props.display}}>
                  {this.renderRedirect()}
                  <a
                  className="button-item "
                  className = {this.props.buttonStyle}
                  onClick={this.setRedirect}>
                  {this.props.text}</a>
</div>
    );
  }
}

export default withRouter(RedirectButton);
