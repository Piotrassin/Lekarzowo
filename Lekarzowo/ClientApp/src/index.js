import React from 'react';
import ReactDOM from 'react-dom';
import history from './History.js';
import './index.css';
import App from './App';
import { Router } from 'react-router-dom'
import VisitDetails from './VisitDetails'
import DateStepper from './DateStepper'
import Dashboard from './Dashboard'
import './Main.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
   <Router history={history}>
  <App/>
  </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
