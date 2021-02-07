import React, { useState, useEffect } from "react";
import {
  makeStyles,
  fade,
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
  Card,
  CardHeader,
  colors,
  ListItemAvatar,
} from "@material-ui/core";
import {
  SupervisorAccount,
  Menu,
  Brightness7,
  Brightness4,
  AccountCircle,
  ExitToApp,
} from "@material-ui/icons";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import { ThemeContext } from "../../context/useTheme";
import Routes from "./Routes";
import clsx from "clsx";
import { useHistory, useLocation } from "react-router-dom";
import Axios from "axios";
import { VpnKey, AccessibilityNew } from "@material-ui/icons";
import EmailIcon from "@material-ui/icons/Email";

const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
  avatar: {
    color: theme.palette.getContrastText(colors.blue[600]),
    backgroundColor: colors.blue[600],
  },
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: { marginRight: theme.spacing(2) },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  toggleIcon: { marginLeft: theme.spacing(3), float: "right" },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
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
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const drawerItems = [
  {
    name: "Admin Interface",
    icon: <SupervisorAccount />,
  },
  {
    name: "Teacher Interface",
    icon: <AccountCircle />,
  },
  {
    name: "Coordinator Interface",
    icon: <SupervisedUserCircleIcon />,
  },
];

export default function ClippedDrawer() {
  const classes = useStyles();

  const location = useLocation();
  const history = useHistory();

  const { dark, toggleTheme } = React.useContext(ThemeContext);

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
  const [open, setOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleDrawer = () => setOpen(!open);
  const handleLogout = () => {
    sessionStorage.removeItem("usertoken");
    sessionStorage.removeItem("user");
    history.push("");
  };

  useEffect(() => {
    Axios.get(
      `http://localhost:8000/api/staff/${
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
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar} color="inherit">
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
          <IconButton onClick={toggleTheme} className={classes.toggleIcon}>
            {dark ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton onClick={handleLogout}>
            <ExitToApp />
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
          <Card>
            {user && (
              <CardHeader
                title={`${user.firstName} ${user.lastName}`}
                avatar={
                  <Avatar className={classes.avatar}>{`${user.firstName.charAt(
                    0
                  )}${user.lastName.charAt(0)}`}</Avatar>
                }
                titleTypographyProps={{ variant: "h4" }}
                subheaderTypographyProps={{ variant: "h6" }}
              />
            )}
            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="textPrimary">
                      Email
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" color="textPrimary">
                      {user.email}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <VpnKey />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="textPrimary">
                      Registration ID
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" color="textPrimary">
                      {user.reg_id}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <AccessibilityNew />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" color="textPrimary">
                      Admin User
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" color="textPrimary">
                      {user.is_admin === 1 ? "Yes" : "No"}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Card>
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
    </div>
  );
}
