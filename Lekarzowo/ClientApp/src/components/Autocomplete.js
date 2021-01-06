import React from 'react';
import Main from '../Main.css'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import UserService from  '../services/UserService.js';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
  label: {
    display: 'block',
    color: 'white',
  },
  input: {
    color: 'white',

  },
  inputHolder: {
    color: 'white',


  },
  listbox: {
    width: 200,
    margin: 0,
    padding: 0,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer',
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white',
    },
  },
}));

export default function Asynchronous(props) {
  const [def, setDef] = React.useState(null);
  const [defAuto, setDefAuto] = React.useState(null);
  const [touched, setTouched] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [requesting, setRequesting] = React.useState(true);
  const [origOptions, setOrigOptions] = React.useState([]);
  const loading = open && requesting;
  const classes = useStyles();

  const delayedQuery = React.useCallback(_.debounce(q => sendQuery(q), 1000), []);

  async function sendQuery(value){
    if(props.addId != undefined){
      var requestOptions = (await props.requestCallback(value, 8, 0, props.addId).catch(err => {
        setOptions([]);
      }));
    }else {
      var requestOptions = (await props.requestCallback(value, 8).catch(err => {
        setOptions([]);

      }));
    }

    if(requestOptions){
     requestOptions = requestOptions.reduce(function(acc, curr) {
      if(curr.lastname){
        curr.name = curr.name.concat(" ", curr.lastname);
      }
      acc[curr.id] = curr;
      return acc;
    }, {});


      setOptions(Object.keys(requestOptions).map((key) => requestOptions[key]));
    }else {
      setOptions([]);
      //setRequesting(false);
    }

  }

  async function handleInputChange(event) {
    //setRequesting(true);
    delayedQuery(event.target.value);

  }

  function onChangeAutoComplete(event, value) {
    if(value != null){
      props.changeCallback(value);

    }else {
      props.changeCallback("");
    }
    setDefAuto(value);
    setTouched(true);

  }


  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      setRequesting(true);
      if(props.addId != undefined){
        var requestOptions = (await props.requestCallback('', 8, 0, props.addId).catch(err => {
          setOptions([]);
          setRequesting(false);
        }));
      }else {
        var requestOptions = (await props.requestCallback('', 8).catch(err => {
          setOptions([]);
          setRequesting(false);
        }));
      }

      if(requestOptions){
        requestOptions = requestOptions.reduce(function(acc, curr) {
          if(curr.lastname){
            curr.name = curr.name.concat(" ", curr.lastname);
          }
          acc[curr.id] = curr;
          return acc;
        }, {});
        if (active) {
          setOptions(Object.keys(requestOptions).map((key) => requestOptions[key]));
          setOrigOptions(Object.keys(requestOptions).map((key) => requestOptions[key]));
        }else {
          setOptions([]);
        }
      }else {
        setOptions([]);
      }
      setRequesting(false);




    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if(props.selectedCustomValue && props.selectedCustomValue != null && touched == false){
      const customTab = [props.selectedCustomValue];
      setOptions(customTab);
      setDefAuto(customTab[0]);
    }
    if (!open) {
      //setOptions([]);


    }
  }, [open]);

  return (
    <Autocomplete
      data-testid = {props.dataTestId}
      id={props.cssId}
      style={props.styles}
      key={props.clear}
      open={open}
      className={classes.inputHolder}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        if(defAuto == null || defAuto == ""){
          setOptions(origOptions);
        }
        setOpen(false);
      }}
      onChange = {onChangeAutoComplete}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      value={defAuto}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.title}
          value={def}
          className={classes.input}
          variant={props.variant}
          size="small"
          onChange={handleInputChange}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
