import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {Link} from "react-router-dom";
import RLink from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Message} from './Message';
import * as FetchData from "../FetchData"

function CustomLink(props) {
  const classes = useStyles();
  return <Link to={props.to} className={classes.noLinkDefault}>
    <RLink color={props.color} variant={props.variant}>
      {props.value}
    </RLink>
  </Link>
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <CustomLink to='/' color="inherit" value="Brain.AI"/>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  noLinkDefault: {
    'color': 'unset',
    textDecoration: 'none'
  }
}));

export function SignIn() {
  const classes = useStyles();

  const [message, setMessage] = React.useState(["", ""]);
  const messageRef = React.useRef();

  const onSubmit = (event) => {
    event.preventDefault();

    const email = event.target[0].value;
    const password = event.target[2].value;

    FetchData.signIn(email, password).then(() => {
      setMessage(["success", "Sign In Successful."]);
      messageRef.current.setOpen(true);
    }).catch(() => {
      setMessage(["error", "Invalid Email or Password!"]);
      messageRef.current.setOpen(true);
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary"/>}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <CustomLink to="/signup" variant="body2" value="Don't have an account? Sign Up"/>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright/>
      </Box>
      <Message ref={messageRef} severity={message[0]} value={message[1]}/>
    </Container>
  );
}

export function SignUp() {
  const classes = useStyles();

  const [message, setMessage] = React.useState(["", ""]);
  const messageRef = React.useRef();

  const onSubmit = (event) => {
    event.preventDefault();

    const email = event.target[0].value;
    const password = event.target[2].value;
    FetchData.signUp(email, password).then(() => FetchData.signIn(email, password)).then(() => {
      setMessage(["success", "Sign Up Successful."]);
      messageRef.current.setOpen(true);
    }).catch(() => {
      setMessage(["error", "Invalid Email or Password!"]);
      messageRef.current.setOpen(true);
    });
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item>
              <CustomLink to="/signin" variant="body2" value="Already have an account? Sign in"/>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright/>
      </Box>
      <Message ref={messageRef} severity={message[0]} value={message[1]}/>
    </Container>
  );
}

export default SignInUp;
