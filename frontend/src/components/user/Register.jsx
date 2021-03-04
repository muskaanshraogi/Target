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
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { Brightness4, Brightness7, LockOpenOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Link as RRDLink, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import Axios from "axios";

import { ThemeContext } from "../../context/useTheme";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: "5%",
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

export default function Register() {
  const classes = useStyles();

  const { dark, toggleTheme } = useContext(ThemeContext);

  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();

  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    reg_id: "",
    email: "",
    password: "",
    confpass: "",
    mobile: [""],
    is_admin: false,
  });

  const handleChange = (e) => {
    const et = e.target;
    if (!!et.id) {
      setDetails({ ...details, [et.id]: et.value });
    } else {
      setDetails({ ...details, [et.name]: et.value });
    }
  };

  const handleAdmin = (e) => {
    let et = e.target;
    if (!!et.id) {
      setDetails({ ...details, [et.id]: et.checked });
    } else {
      setDetails({ ...details, [et.name]: et.checked });
    }
  };

  const handleMobile = (event) => {
    let newMobile = [...details.mobile];
    newMobile[parseInt(event.target.id)] = parseInt(event.target.value);
    setDetails({ ...details, mobile: newMobile });
  };

  const handleAdd = () =>
    setDetails({ ...details, mobile: [...details.mobile, [""]] });

  const handleRemove = () =>
    setDetails({
      ...details,
      mobile: details.mobile.slice(0, details.mobile.length - 1),
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !details.firstName ||
      !details.lastName ||
      !details.email ||
      !details.password ||
      !details.confpass ||
      !details.reg_id
    ) {
      enqueueSnackbar("All fields must be filled!", { variant: "error" });
      return;
    }
    if (details.password.length < 8) {
      enqueueSnackbar("Password Length should be 8 characters", {
        variant: "error",
      });
      return;
    }
    if (details.password !== details.confpass) {
      enqueueSnackbar("Password mismatch!", { variant: "error" });
      return;
    }
    if (details.mobile[0] === "") {
      enqueueSnackbar("1 Phone numer is mandatory!", { variant: "error" });
      return;
    }
    Axios.post("http://localhost:8000/api/staff/register", details, {
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
        enqueueSnackbar("Already Registered!", { variant: "error" });
      });
  };

  return (
    <>
      <Container component="main" maxWidth="md">
        <Paper elevation={3}>
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOpenOutlined />
            </Avatar>
            <Typography component="h1" variant="h3">
              Register
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First name"
                name="firstName"
                autoComplete="firstName"
                value={details.firstName}
                autoFocus
                onChange={handleChange}
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
                value={details.lastName}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="reg_id"
                label="Registration ID"
                name="reg_id"
                autoComplete="reg_id"
                value={details.reg_id}
                onChange={handleChange}
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
                value={details.email}
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
                value={details.password}
                autoComplete="current-password"
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confpass"
                label="Confirm Password"
                type="password"
                id="confpass"
                value={details.confpass}
                autoComplete="confirm-password"
                onChange={handleChange}
              />
              {details.mobile.map((m, index) => (
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required={index === 0 ? true : false}
                  name={index}
                  label={`Enter mobile number ${index + 1}`}
                  type="text"
                  id={index}
                  defaultValue={m}
                  autoComplete="mobile"
                  onChange={handleMobile}
                />
              ))}
              {details.mobile.length < 3 && (
                <Button
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={handleAdd}
                >
                  Add Mobile Number
                </Button>
              )}
              {details.mobile.length > 1 && (
                <Button
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={handleRemove}
                >
                  Remove Mobile Number
                </Button>
              )}
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleAdmin}
                    name="is_admin"
                    color="primary"
                  />
                }
                label="Admin Account?"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Register
              </Button>
            </form>
            <Grid container>
              <Grid item>
                <Link component={RRDLink} to="/">
                  Already have an account? Login instead
                </Link>
              </Grid>
            </Grid>
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
