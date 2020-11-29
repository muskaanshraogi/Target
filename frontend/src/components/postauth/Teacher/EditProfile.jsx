import React, { useState } from "react";
import {
  Grid,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  TextField,
  Button,
  makeStyles,
} from "@material-ui/core";
import { useSnackbar } from 'notistack';
import Axios from 'axios'
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles(theme => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
        fontSize: '18px'
      },
      button: {
        margin : theme.spacing(2,1,1,0)
      }
}))

export default function EditProfile() {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState({
    "firstName": "",
    "lastName": "",
    "email": "",
    "mobile": [''],
});

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSubmit = e => {
      e.preventDefault();
      Axios.post(
        `http://localhost:8000/api/staff/update/${sessionStorage.getItem("usertoken")}`,
        details,
        { 
          headers: 
          { 
            'Content-Type': 'application/json' 
          } 
        }
      )
      .then(res => {
        sessionStorage.setItem("usertoken", res.data.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data.data.user));
        enqueueSnackbar('Update Successful', { variant: 'success'});
      })
      .catch(err => {
        enqueueSnackbar('Could not update', { variant: 'error' });
      })
  }

  return (
    <Grid item>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography>Edit Your Profile Here</Typography>
        </AccordionSummary>
        <AccordionDetails>
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={details.email}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Update
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
