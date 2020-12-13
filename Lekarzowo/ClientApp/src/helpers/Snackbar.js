import React, { PureComponent } from 'react';
import '../css/helpers/snackbar.css'

export default class Snackbar extends PureComponent {
  message = ''

  state = {
    isActive: false,
    classes: ""
  }

  openSnackBar = (message = 'Seems there was a problem', classes = 'red-snackbar') => {
    this.message = message;
    this.setState({
      isActive: true,
      classes: classes
     }, () => {
      setTimeout(() => {
        this.setState({ isActive: false });
      }, 3000);
    });
  }

  render() {
    const { isActive } = this.state;
    return (
      <div className = {isActive ? "snackbar show " + this.state.classes  : "snackbar"}>
        {this.message}
      </div>
    )
  }
}
