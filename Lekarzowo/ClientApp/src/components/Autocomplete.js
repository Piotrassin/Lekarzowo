import React from 'react';
import Main from '../Main.css'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import UserService from  '../services/UserService.js';
import { makeStyles } from '@material-ui/core/styles';

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
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const classes = useStyles();

  async function handleInputChange(event) {
    console.log(event.target.value);
    if(props.addId != undefined){
      var requestOptions = (await props.requestCallback(event.target.value, 100, 0, props.addId));
    }else {
      var requestOptions = (await props.requestCallback(event.target.value, 100));
    }

     requestOptions = requestOptions.reduce(function(acc, curr) {
      if(curr.lastname){
        curr.name = curr.name.concat(" ", curr.lastname);
      }
      acc[curr.id] = curr;
      return acc;
    }, {});

    console.log('requestOptions');
    console.log(requestOptions);
      setOptions(Object.keys(requestOptions).map((key) => requestOptions[key]));

  }

  function onChangeAutoComplete(event, value) {
    console.log("inside");
    console.log(value);
    if(value != null){
      props.changeCallback(value);
    }else {
      props.changeCallback("");
    }
  }


  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if(props.addId != undefined){
        var requestOptions = (await props.requestCallback('', 2, 0, props.addId));
      }else {
        var requestOptions = (await props.requestCallback('', 2));
      }


        requestOptions = requestOptions.reduce(function(acc, curr) {
          if(curr.lastname){
            curr.name = curr.name.concat(" ", curr.lastname);
          }
          acc[curr.id] = curr;
          return acc;
        }, {});



      if (active) {
        //setOptions(Object.keys(requestOptions).map((key) => requestOptions[key].item[0]));

        setOptions(Object.keys(requestOptions).map((key) => requestOptions[key]));
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id={props.cssId}
      style={props.styles}
      key={props.clear}
      open={open}
      className={classes.inputHolder}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange = {onChangeAutoComplete}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.title}
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
