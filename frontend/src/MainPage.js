import React from 'react';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {AccountCircle} from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCode, faDatabase, faHatWizard, faTasks} from '@fortawesome/free-solid-svg-icons';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {Data, Model, Task, Wizard, SignIn, SignUp, Test} from './Views'
import {Grid, Box} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {Menu, MenuItem} from '@material-ui/core';

import * as FetchData from "./FetchData"

import {BrowserRouter as Router, Link, Route, Switch, useHistory} from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  icon: {
    paddingLeft: theme.spacing(0.5),
    width: theme.spacing(3),
  },
  noLinkDefault: {
    'color': 'unset',
    textDecoration: 'none'
  }
}));

const currentUser = localStorage.getItem("email");
const token = localStorage.getItem("token");
const signedIn = token != null;

function Profile() {
  const classes = useStyles();
  let history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    // history.push("/")
    FetchData.signOut(localStorage.token).then(() => {
      localStorage.clear();
      window.location.href = "/";
      // handleClose();
    });
  };

  return !signedIn ?
    <Link to={'/signin'} className={classes.noLinkDefault}>
      <Button color="inherit">Login</Button>
    </Link> :
    <div>
      <Button
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        size="large"
        style={{textTransform: 'none'}}
      >
        {currentUser} &nbsp;
        <AccountCircle/>
      </Button>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemText primary="Log Out"/>
        </MenuItem>
      </Menu>
    </div>
}

function MyDrawer(props) {
  const classes = useStyles();
  return <Drawer
    variant="permanent"
    classes={{
      paper: clsx(classes.drawerPaper, !props.open && classes.drawerPaperClose),
    }}
    open={props.open}
  >
    <div className={classes.toolbarIcon}>
      <IconButton onClick={props.close}>
        <ChevronLeftIcon/>
      </IconButton>
    </div>
    <Divider/>
    <List>
      <div>
        <Link to={'/wizard'} className={classes.noLinkDefault}>
          <ListItem button>
            <ListItemIcon className={classes.icon}><FontAwesomeIcon icon={faHatWizard}/></ListItemIcon>
            <ListItemText primary={'Wizard'}/>
          </ListItem>
        </Link>

        <Link to={'/data'} className={classes.noLinkDefault}>
          <ListItem button>
            <ListItemIcon className={classes.icon}><FontAwesomeIcon icon={faDatabase}/></ListItemIcon>
            <ListItemText primary={'Data'}/>
          </ListItem>
        </Link>

        <Link to={'/model'} className={classes.noLinkDefault}>
          <ListItem button>
            <ListItemIcon className={classes.icon}><FontAwesomeIcon icon={faCode}/></ListItemIcon>
            <ListItemText primary={'Model'}/>
          </ListItem>
        </Link>

        <Link to={'/task'} className={classes.noLinkDefault}>
          <ListItem button>
            <ListItemIcon className={classes.icon}><FontAwesomeIcon icon={faTasks}/></ListItemIcon>
            <ListItemText primary={'Task'}/>
          </ListItem>
        </Link>
      </div>
    </List>
    <Divider/>
  </Drawer>
}

function MainPage(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline/>
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
              <MenuIcon/>
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              Brain.AI
            </Typography>
            <Profile/>
          </Toolbar>
        </AppBar>
        <MyDrawer open={open} close={handleDrawerClose}/>
        <main className={classes.content}>
          <div className={classes.appBarSpacer}/>
          <Box mt={2} ml={2} mr={2}>
            {signedIn ?
              <Switch>
                <Route path="/wizard">
                  <Wizard/>
                </Route>
                <Route path="/data">
                  <Data/>
                </Route>
                <Route path="/model">
                  <Model/>
                </Route>
                <Route path="/task">
                  <Task/>
                </Route>
                <Route path="/test">
                  <Test/>
                </Route>
                <Route path="/">
                  <Wizard/>
                </Route>
              </Switch> :
              <Switch>
                <Route path="/signup">
                  <SignUp/>
                </Route>
                <Route path="/">
                  <div><SignIn/></div>
                </Route>
              </Switch>
            }
          </Box>
        </main>
      </Router>
    </div>
  );
}

export default MainPage;
