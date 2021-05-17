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
import { RiLockPasswordFill } from "react-icons/ri";
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
}));

export default function ResetPassword(props) {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [details, setDetails] = useState({
    email: props.match.params.email,
    newpassword: "",
    confirmpassword: "",
  });

  const handleChange = (e) => {
    const et = e.target;
    if (!!et.id) setDetails({ ...details, [et.id]: et.value });
    else setDetails({ ...details, [et.name]: et.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(details)
    if (!details.newpassword || !details.confirmpassword) {
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      return;
    }
    if (details.newpassword !== details.confirmpassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    Axios.post(`${process.env.REACT_APP_HOST}/api/staff/reset`, {details}, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        enqueueSnackbar("Password Reset", { variant: "success" });
        history.push("/");
      })
      .catch((err) => {
        enqueueSnackbar("Failed to reset password", {
          variant: "error",
        });
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
          <Typography className={classes.target}>Target</Typography>
        </Hidden>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Hidden smDown>
            <Avatar className={classes.avatar}>
              <RiLockPasswordFill />
            </Avatar>
          </Hidden>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="newpassword"
              label="New Password"
              type="password"
              id="newpassword"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmpassword"
              label="Confirm New Password"
              type="password"
              id="confirmpassword"
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
              Reset Password
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
