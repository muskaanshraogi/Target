import React, { useState } from "react";
import {
  Hidden,
  Typography,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Grid,
  Avatar,
} from "@material-ui/core";
import { FaUserPlus } from "react-icons/fa";
import { makeStyles } from "@material-ui/styles";
import { Link as RRDLink, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    fontSize: "15px",
  },
  paper: {
    padding: theme.spacing(0, 8),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5DC",
    boxShadow: "0 2px 150px rgba(0, 0, 0, 0.4)",
  },
  image: {
    backgroundColor: "#69D2E7",
    backgroundSize: "cover",
    backgroundPosition: "30%",
  },
  target: {
    fontFamily: "'Pacifico', cursive",
    height: "90%",
    fontSize: "120px",
    textShadow: "4px 6px rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    fontSize: "18px",
  },
  avatar: {
    backgroundColor: "#E50058",
    fontSize: "25px",
    height: "7%",
    width: "10%",
  },
  button: {
    margin: theme.spacing(1, 1, 0, 0),
  },
}));

export default function Register() {
  const classes = useStyles();
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
    Axios.post(`${process.env.REACT_APP_HOST}/api/staff/register`, details, {
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
        console.log(err)
        enqueueSnackbar("Already Registered!", { variant: "error" });
      });
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        alignContents="center"
        className={classes.image}
      >
        <Hidden smDown>
          <Typography component="h1" variant="h1" className={classes.target}>
            Target
          </Typography>
        </Hidden>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Hidden smDown>
            <Avatar className={classes.avatar}>
              <FaUserPlus />
            </Avatar>
          </Hidden>
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
                color="primary"
                variant="outlined"
                onClick={handleAdd}
              >
                Add Mobile Number
              </Button>
            )}
            {details.mobile.length > 1 && (
              <Button
                className={classes.button}
                color="primary"
                variant="outlined"
                onClick={handleRemove}
              >
                Remove Mobile Number
              </Button>
            )}
            <br />
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
      </Grid>
    </Grid>
  );
}
