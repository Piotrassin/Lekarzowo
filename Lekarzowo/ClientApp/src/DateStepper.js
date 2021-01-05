import Stepper from '@material-ui/core/Stepper';
import React from 'react';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import RedirectButton from "./RedirectButton";
import Snackbar from './helpers/Snackbar.js';

class DateStepper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activeStep: 0,
      type: this.props.type,
      visit_arr: []
    };
    this.setActiveStep = this.setActiveStep.bind(this);
  }
  componentDidMount() {
      fetch('https://localhost:44360/api/Visits/List')
        .then(response => response.json())
        .then(dataMine =>
          this.setState({ visit_arr: dataMine })
          //console.log(dataMine)
        )
        .catch(err => console.log(err));

  }

  getStepperDates(){
    return this.state.visit_arr.filter((value) => new Date(value.reservationStartTime) > Date.now())
    //return ['20.12.2019', '10.12.2019', '11.12.2019', '2019,12-12'];
    //return this.state.visit_arr;
  }

  getPreviousDates() {
    //return ['11.12.2019', '2019,12-12']
    //return this.state.visit_arr;
    return this.state.visit_arr.filter((value) => new Date(value.reservationStartTime) <= Date.now())
  }

  getStepContent(step){
    switch (step) {
      case 0:
        return "Hloo 1"
      case 1:
        return "Hloo2"
      case 2:
        return "Hloo 3"
      default:
        return "Heloo del"
    }
  }

  setActiveStep(step) {
    this.setState({activeStep: step});
  }

  handleNext = () => {
    this.setActiveStep(this.state.activeStep + 1);
  }

  handleBack = () => {
    this.setActiveStep(this.state.activeStep - 1);
  }

  render() {
    var steps = this.state.type == 0 ? this.getStepperDates() :
      this.getPreviousDates();
    return (
        <div className="stepper" >
            <b className="big-black">{this.props.title}</b>

        <Stepper
        activeStep = {this.state.activeStep}
        orientation = "vertical"
        >
        {steps.map((label, index) => (
          <Step
          key = {label.reservationId} >
            <StepLabel>{label.reservationStartTime.split("T")[0]}</StepLabel>

            


          </Step>
        ))}
        </Stepper>
      </div>
    );
  }


}
export default DateStepper;
