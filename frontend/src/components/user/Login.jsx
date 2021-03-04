import React, { useState, useContext } from "react";
import {
  Fab,
  Container,
  Avatar,
  Typography,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Paper,
} from "@material-ui/core";
import { Brightness4, Brightness7, LockOpenOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Link as RRDLink, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import Axios from "axios";

import { ThemeContext } from "../../context/useTheme";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: "30%",
    padding: "4%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  fab: {
    position: "absolute",
    top: theme.spacing(2),
    left: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
}));

export default function Login() {
  const classes = useStyles();

  const history = useHistory();

  const { dark, toggleTheme } = useContext(ThemeContext);

  const { enqueueSnackbar } = useSnackbar();

  const [details, setDetails] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const et = e.target;
    if (!!et.id) setDetails({ ...details, [et.id]: et.value });
    else setDetails({ ...details, [et.name]: et.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details.email || !details.password) {
      enqueueSnackbar("Please fill all fields to login", { variant: "error" });
      return;
    }
    Axios.post("http://localhost:8000/api/staff/login", details, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        sessionStorage.setItem("usertoken", res.data.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data.data.user));
        enqueueSnackbar("Login Successful", { variant: "success" });
        history.push("/home");
      })
      .catch((err) => {
        enqueueSnackbar("Invalid credentials", {
          variant: "error",
        });
      });
  };

  return (
    <>
      <Container component="main" maxWidth="md">
        <Paper elevation={3}>
          <CssBaseline />
          <div className={classes.paper}>
            <Typography variant="h2">TARGET</Typography>

            <form className={classes.form} noValidate onSubmit={handleSubmit}>
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
                onChange={handleChange}
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
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSubmit}
              >
                LOGIN
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link component={RRDLink} to="/register">
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Paper>
      </Container>
      <Fab
        color="secondary"
        aria-label="toggle"
        onClick={toggleTheme}
        className={classes.fab}
      >
        {dark ? <Brightness7 /> : <Brightness4 />}
      </Fab>
    </>
  );
}
