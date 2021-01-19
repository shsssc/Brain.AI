import React, {forwardRef, useRef} from 'react';
import Grid from "@material-ui/core/Grid";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {AddBox, Create, Add, Search, Cached, Stop, CloudDownload, Delete, CloudUpload} from "@material-ui/icons";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Switch from '@material-ui/core/Switch';
import Paper from "@material-ui/core/Paper";
import Select from '@material-ui/core/Select';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Dialog,
  DialogTitle, DialogContent, DialogContentText, TextField, DialogActions
} from '@material-ui/core';
import * as FetchData from "../FetchData";
import {Message} from "./Message";
import DropArea from "./DropArea";
import MenuItem from '@material-ui/core/MenuItem';
import {useHistory} from "react-router-dom";
import ReactJson from 'react-json-view';

const useStyles = makeStyles(theme => ({
  grid: {
    //backgroundColor:'red',
  },
  searchButton: {
    position: 'relative',
  },
  main: {
    paddingTop: 24,
  },
  media: {
    height: 240,
  },
  card: {
    margin: 16
  },
  date: {
    textAlign: 'left',
    paddingLeft: 12,
  }

}));

class MySwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rows: []};
  }

  fetchData() {
    FetchData.getDataList().then((rows) => {
      this.setState({rows: rows.filter(row => row[2] === this.props.type)});
    }).catch();
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (<Select
        labelId="dataid"
        id="dataid"
        onChange={this.props.onChange}
        style={{"minWidth": 450}}
      >
        {this.state.rows.map(row =>
          <MenuItem key={row[0]} value={row[0]}>{`${row[1]} (Data ID: ${row[0]})`}</MenuItem>
        )}
      </Select>
    )
  }
}

const MyDialog = forwardRef((props, ref) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [callback, setCallback] = React.useState(null);
  const [data, setData] = React.useState("");

  const handleDataIdChange = (event) => {
    setData(event.target.value);
  };

  React.useImperativeHandle(ref, () => ({
    handleClickOpen(callback) {
      setCallback(() => callback);
      setOpen(true);
      setData(-1);
    }
  }));

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = () => {
    handleClose();
    callback(data);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.text}
          </DialogContentText>
          {props.label === "Data ID" ?
            <MySwitch onChange={handleDataIdChange} type={props.type}/>
            : <TextField
              autoFocus
              margin="dense"
              label={props.label}
              fullWidth
              onChange={handleDataIdChange}
            />
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={onSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

const InfoDialog = forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);

  React.useImperativeHandle(ref, () => ({
    handleClickOpen(v) {
      setValue(v);
      setOpen(true);
    }
  }));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">{"Info"}</DialogTitle>
      <DialogContent>
        <ReactJson src={JSON.parse(value)} name="metadata"/>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>)
});

class ModelTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rows: [], searchStr: ""};
    this.runDialog = React.createRef();
    this.renameDialog = React.createRef();
    this.infoDialog = React.createRef();
  }

  fetchData() {
    FetchData.getModelList().then((rows) => {
      this.setState({rows: rows});
    });
    console.log("Model Fetched");
  }

  componentDidMount() {
    this.fetchData();
    this.intervalID = setInterval(() => this.fetchData(), 2000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  removeCallback(id) {
    return () => {
      FetchData.deleteModel(id).then(() => {
        this.props.sendMessage(["success", "Model Removed!"]);
        this.fetchData();
      });
    }
  }

  shareCallback(id) {
    return event => {
      FetchData.shareModel(id, event.target.checked).then(() => {
        this.props.sendMessage(["success", "Model Sharing Setting Changed!"]);
        this.fetchData();
      });
    };
  }

  runModelCallback(id) {
    return (dataId) => {
      FetchData.createTask("prediction", dataId, id).then(() => {
        this.props.sendMessage(["success", "Prediction Task Created!"]);
        setTimeout(() => this.props.history.push("/task"), 1000);
      }).catch((error) => {
        this.props.sendMessage(["error", "Invalid Data ID"]);
      });
    };
  }

  renameCallback(id) {
    return (name) => {
      FetchData.renameModel(id, name).then(() => {
        this.props.sendMessage(["success", "Model Renamed!"]);
        this.fetchData();
      }).catch((error) => {
        this.props.sendMessage(["error", "Rename Failed"]);
      });
    };
  }

  render() {
    var rows = this.state.rows;
    if (this.state.searchStr != "")
      rows = rows.filter((row) => row[1].match(this.state.searchStr) != null)

    return <TableContainer component={Paper}>
      <Table className={this.props.classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Onwer</TableCell>
            <TableCell align="left">Share</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row[0]}>
              <TableCell scope="row">{row[0]}</TableCell>
              <TableCell>{row[1]}</TableCell>
              <TableCell>{row[3] ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Switch
                  disabled={!row[3]}
                  checked={Boolean(row[2])}
                  onChange={this.shareCallback(row[0])}
                  inputProps={{'aria-label': 'secondary checkbox'}}
                />
              </TableCell>
              <TableCell>
                <Button size="small" color="primary" onClick={
                  () => {
                    this.runDialog.current.handleClickOpen(this.runModelCallback(row[0]))
                  }
                }>
                  Run
                </Button>
                {row[4] ?
                  <Button size="small" color="primary" onClick={
                    () => {
                      this.infoDialog.current.handleClickOpen(row[4])
                    }
                  }>
                    Info
                  </Button> : null
                }
                <Button size="small" color="primary" onClick={
                  () => {
                    this.renameDialog.current.handleClickOpen(this.renameCallback(row[0]))
                  }
                } disabled={!row[3]}>
                  Rename
                </Button>
                <Button size="small" color="primary" onClick={this.removeCallback(row[0])} disabled={!row[3]}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <MyDialog text="Please enter the Data ID that is used for making prediction."
                label="Data ID" ref={this.runDialog} title="Prediction" type="Prediction Set"/>
      <MyDialog text="Please enter the new name of this model."
                label="Name" ref={this.renameDialog} title="Rename Model"/>
      <InfoDialog ref={this.infoDialog}/>
    </TableContainer>
  }
}

export default function Model() {
  const [message, setMessage] = React.useState(["", ""]);
  const messageRef = React.useRef();
  const tableRef = useRef();
  const dialogRef = useRef();
  const classes = useStyles();
  const history = useHistory();
  const sendMessage = (m) => {
    setMessage(m);
    messageRef.current.setOpen(true);
  };

  const createNewModel = (dataId) => {
    FetchData.createTask("training", dataId).then(() => {
      sendMessage(["success", "Model Created!"]);
      tableRef.current.fetchData();
      setTimeout(() => history.push("/task"), 1000);
    }).catch((error) => {
      sendMessage(["error", "Invalid Data ID"]);
    });
  };

  const handleSearchChange = (event) => {
    tableRef.current.setState({searchStr: event.target.value})
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={4} justify={'flex-start'} container>
          <Grid><Typography variant={'h4'}>&nbsp;&nbsp;Models</Typography></Grid>
        </Grid>
        <Grid container item spacing={1} alignItems="flex-end" justify={'flex-end'} xs={8}>
          <Grid item>
            <FormControl className={classes.margin} variant='outlined'>
              <Input
                id="input-with-icon-adornment"
                onChange={handleSearchChange}
                startAdornment={
                  <InputAdornment position="start">
                    <Search/>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Grid>
          <Grid>
            <Button
              variant="outlined"
              color="default"
              className={classes.searchButton}
              startIcon={<Create/>}
              onClick={() => {
                return dialogRef.current.handleClickOpen(createNewModel);
              }}
            >
              New Model
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <MyDialog text="Please enter the Data ID that is used for training a new model."
                label="Data ID" ref={dialogRef} title="Create New Model" type="Training Set"/>
      <Box mt={2}><ModelTable classes={classes} sendMessage={sendMessage} ref={tableRef} history={history}/></Box>
      <Message ref={messageRef} severity={message[0]} value={message[1]}/>
    </div>
  );
}
