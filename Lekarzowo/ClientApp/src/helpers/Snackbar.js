import React, { PureComponent } from 'react';
import '../css/helpers/snackbar.css'

export default class Snackbar extends PureComponent {
  message = ''

  state = {
    isActive: false,
  }

  openSnackBar = (message = 'Seems there was a problem') => {
    this.message = message;
    this.setState({ isActive: true }, () => {
      setTimeout(() => {
        this.setState({ isActive: false });
      }, 3000);
    });
  }

  render() {
    const { isActive } = this.state;
    return (
      <div className = {isActive ? "snackbar show" : "snackbar"}>
        {this.message}
      </div>
    )
  }
}
