import React, { useState } from "react";
import {
  CssBaseline,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    fontSize: "15px",
  },
  paper: {
    padding: theme.spacing(2, 4),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F5F5DC",
  },
}));

export default function ResetAck() {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
        <div className={classes.paper}>
          A link to reset your password has been sent to you via email.
        </div>
    </Grid>
  );
}
