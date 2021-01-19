import React, {useRef, useState} from 'react';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {CloudUpload, Search} from "@material-ui/icons";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import {CardHeader, CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import LinearProgress from '@material-ui/core/LinearProgress';

import {TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {Radio, RadioGroup, FormHelperText, FormControlLabel, FormControl, FormLabel} from '@material-ui/core';

import * as FetchData from "../FetchData"
import DropArea from "./DropArea";
import {Message} from './Message';


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
  },
  progress: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  }
}));

function FormDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [progessBar, setProgessBar] = React.useState(false);

  const fileRef = React.useRef();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sentError = () => {
    props.sendMessage(["error", "Invalid Name or Data!"]);
  };

  const onSubmit = () => {
    setProgessBar(true);
    let files = fileRef.current.state.files;
    if (files.length !== 1) {
      sentError();
      return;
    }
    FetchData.uploadData(name, files[0]).then(() => {
      props.sendMessage(["success", "Upload Successful."]);
      handleClose();
      props.refreshTable();
    }).catch((error) => {
      sentError();
    }).finally(() => setProgessBar(false));
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="default"
        className={classes.searchButton}
        startIcon={<CloudUpload/>}
        onClick={handleClickOpen}
      >
        Upload
      </Button>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">Upload Data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the Name for this data.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Data Name"
            fullWidth
            onChange={handleNameChange}
          />
        </DialogContent>

        <DialogContent>
          <DialogContentText>
            Please select the data file to upload.
          </DialogContentText>
          <DropArea ref={fileRef}/>
        </DialogContent>

        <DialogActions>
          <Button onClick={onSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
        <div className={classes.progress} hidden={!progessBar}>
          <LinearProgress color="secondary"/>
        </div>
      </Dialog>
    </div>
  );
}

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rows: [], searchStr: ""};
  }

  fetchData() {
    FetchData.getDataList().then((rows) => {
      this.setState({rows: rows});
    });
    console.log("Data Fetched");
  }

  componentDidMount() {
    this.fetchData();
    this.intervalID = setInterval(() => this.fetchData(), 2000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  removeDataCallback(id) {
    return () => {
      FetchData.deleteData(id).then(() => {
        this.props.sendMessage(["success", "Data Removed!"]);
        this.fetchData();
      });
    }
  }

  render() {
    var rows = this.state.rows;
    if (this.state.searchStr != "")
      rows = rows.filter((row) => row[1].match(this.state.searchStr) != null)

    return (
      <Grid item xs={12} container className={this.props.classes.main}>
        {rows.map(row =>
          <Grid item xs={12} sm={6} md={4} lg={3} key={row[0]}>
            <Card className={this.props.classes.card}>
              <CardHeader
                title={row[1]}
                subheader={"ID: " + row[0] + ", " + row[2]}
              />
              <CardActionArea>
                <CardMedia
                  className={this.props.classes.media}
                  image={"data:image/png;base64," + row[3]}
                  title={row[1]}
                />
                {/*<Typography variant={'subtitle2'} color={"textSecondary"} className={classes.date}>{row[5]}</Typography>*/}
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary" onClick={this.removeDataCallback(row[0])}>
                  Remove
                </Button>
                <Button size="small" color="primary" href={row[4]} target="_blank">
                  Download
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )}
      </Grid>
    );
  }
}

export default function Data() {
  const classes = useStyles();
  const tableRef = useRef();
  const [message, setMessage] = React.useState(["", ""]);
  const messageRef = React.useRef();
  const sendMessage = (m) => {
    setMessage(m);
    messageRef.current.setOpen(true);
  };
  const handleSearchChange = (event) => {
    tableRef.current.setState({searchStr: event.target.value})
  };

  return (
    <div className="App">
      <Grid container>
        <Grid item xs={4} justify={'flex-start'} container>
          <Typography variant={'h4'}>&nbsp;&nbsp;Data</Typography>
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
          <Grid item>
            <FormDialog refreshTable={() => tableRef.current.fetchData()} sendMessage={sendMessage}/>
          </Grid>
        </Grid>
        <DataTable classes={classes} ref={tableRef} sendMessage={sendMessage}/>
      </Grid>
      <Message ref={messageRef} severity={message[0]} value={message[1]}/>
    </div>
  );
}
