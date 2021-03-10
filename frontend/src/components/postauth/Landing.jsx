import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Grid,
  Avatar,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
} from "@material-ui/core";
import {
  SupervisorAccount,
  Menu,
  AccountCircle,
  ExitToApp,
} from "@material-ui/icons";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import Routes from "./Routes";
import clsx from "clsx";
import { useHistory, useLocation } from "react-router-dom";
import Axios from "axios";
import { useSnackbar } from "notistack";

const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
  edit: {
    color: "#FFFFFF",
    backgroundColor: "#E50058",
    height: theme.spacing(8),
    width: theme.spacing(8),
    marginLeft: "40%",
  },
  avatar2: {
    color: "#FFFFFF",
    backgroundColor: "#E50058",
  },
  avatar: {
    color: "#FFFFFF",
    backgroundColor: "#193B55",
  },
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: { marginRight: theme.spacing(2) },
  title: {
    fontFamily: "'Pacifico', cursive",
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflowX: "none",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  list: {
    paddingLeft: theme.spacing(1),
  },
  backDrop: {
    backdropFilter: "blur(3px)",
    backgroundColor: "rgba(69,69,69,0.8)",
  },
  listItem: {
    padding: "0 auto",
  },
}));

const drawerItems = [
  {
    name: "Admin Interface",
    icon: <SupervisorAccount color="primary" />,
  },
  {
    name: "Teacher Interface",
    icon: <AccountCircle color="primary" />,
  },
  {
    name: "Coordinator Interface",
    icon: <SupervisedUserCircleIcon color="primary" />,
  },
];

export default function ClippedDrawer() {
  const classes = useStyles();

  const location = useLocation();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [profile, setProfile] = useState(false);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    is_admin: 1,
    reg_id: "",
    division: null,
    roleName: null,
    subName: null,
    year: null,
  });

  const toggleDrawer = () => setOpen(!open);

  const handleEdit = (e) => {
    const et = e.target;
    if (!!et.id) {
      setUser({ ...user, [et.id]: et.value });
    } else {
      setUser({ ...user, [et.name]: et.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(
      `${process.env.REACT_APP_HOST}/api/staff/update/${
        JSON.parse(sessionStorage.getItem("user")).reg_id
      }`,
      user,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        setUser(user);
        let jsonObj = JSON.parse(sessionStorage.getItem("user"));
        jsonObj.firstName = user.firstName;
        jsonObj.lastName = user.lastName;
        jsonObj.email = user.email;
        sessionStorage.setItem("user", JSON.stringify(user));
        handleDialog(false);
        enqueueSnackbar("Update Successful", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Could not update", { variant: "error" });
      });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("usertoken");
    sessionStorage.removeItem("user");
    history.push("");
  };

  const handleDialog = () => {
    setDialog(!dialog);
  };

  const getDetails = () => {
    Axios.get(
      `${process.env.REACT_APP_HOST}/api/staff/${
        JSON.parse(sessionStorage.getItem("user")).reg_id
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    ).then((res) => {
      setUser(res.data.data[0]);
      setIsAdmin(() => (res.data.data[0].is_admin === 0 ? false : true));
    });
  };

  const handleClick = () => {
    setProfile(!profile);
  };

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    let user = sessionStorage.getItem("user");
    if (!user) {
      history.push("/");
    }
  });

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar} color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.logo}
            color="inherit"
            onClick={toggleDrawer}
          >
            <Menu />
          </IconButton>
          <Typography variant="h4" className={classes.title}>
            Target
          </Typography>
          <Button aria-controls="simple-menu" onClick={handleClick}>
            <Avatar className={classes.avatar}>{`${user.firstName.charAt(
              0
            )}${user.lastName.charAt(0)}`}</Avatar>
          </Button>
          <IconButton onClick={handleLogout}>
            <Tooltip title="Logout">
              <ExitToApp style={{ height: "25px", color: "#ffffff" }} />
            </Tooltip>
            <Typography style={{ height: "25px", color: "#ffffff" }}>
              Logout
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        variant="permanent"
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {isAdmin && (
              <ListItem
                key={0}
                selected={location.pathname.includes(
                  drawerItems[0].name.split(" ")[0].toLowerCase()
                )}
                onClick={() =>
                  history.push(
                    `/home/${drawerItems[0].name.split(" ")[0].toLowerCase()}`
                  )
                }
                button
              >
                <ListItemIcon className={classes.list}>
                  {drawerItems[0].icon}
                </ListItemIcon>
                <ListItemText primary={drawerItems[0].name} />
              </ListItem>
            )}
            <ListItem
              key={1}
              selected={location.pathname.includes(
                drawerItems[1].name.split(" ")[0].toLowerCase()
              )}
              onClick={() =>
                history.push(
                  `/home/${drawerItems[1].name.split(" ")[0].toLowerCase()}`
                )
              }
              button
            >
              <ListItemIcon className={classes.list}>
                {drawerItems[1].icon}
              </ListItemIcon>
              <ListItemText primary={drawerItems[1].name} />
            </ListItem>

            <ListItem
              key={2}
              selected={location.pathname.includes(
                drawerItems[2].name.split(" ")[0].toLowerCase()
              )}
              onClick={() =>
                history.push(
                  `/home/${drawerItems[2].name.split(" ")[0].toLowerCase()}`
                )
              }
              button
            >
              <ListItemIcon className={classes.list}>
                {drawerItems[2].icon}
              </ListItemIcon>
              <ListItemText primary={drawerItems[2].name} />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Grid container spacing={1} direction="row">
          <Routes />
        </Grid>
      </main>
      <Dialog
        open={profile}
        onClose={handleClick}
        BackdropProps={{
          classes: {
            root: classes.backDrop,
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <Avatar className={classes.edit}>{`${user.firstName.charAt(
            0
          )}${user.lastName.charAt(0)}`}</Avatar>
          <Typography variant="h3">
            {`${user.firstName} ${user.lastName}`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {/* <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First name"
              name="firstName"
              autoComplete="firstName"
              value={user.firstName}
              autoFocus
              onChange={handleEdit}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last name"
              name="lastName"
              autoComplete="lastName"
              value={user.lastName}
              onChange={handleEdit}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={user.email}
              onChange={handleEdit}
            />
          </form> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
