import React, { useState, useContext } from 'react';
import { Fab, Hidden, Typography, Button, 
        CssBaseline, TextField, Link, Paper, 
        Grid, FormControlLabel, Checkbox} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Link as RRDLink, useHistory } from 'react-router-dom';
import { Brightness4, Brightness7 } from '@material-ui/icons'
import WavesIcon from '@material-ui/icons/Waves';
import { useSnackbar } from 'notistack';
import Axios from 'axios';

import { setUserTokenCookie } from '../../cookie/cookie';
import { ThemeContext } from '../../context/useTheme';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  paper: {
    margin: theme.spacing(0, 4),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    backgroundImage: theme.palette.type === "light" ? 
    'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80")' 
    : 
    'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80")' 
    ,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: '30%'
  },
  target: {
    fontFamily: "'Open Sans', sans-serif",
    height: '90%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    fontSize: '18px'
  },
  fab: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
  chip: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    }
  }
}));

export default function Register() {

  const classes = useStyles();

  const {dark, toggleTheme} = useContext(ThemeContext);

  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();

  const [details, setDetails] = useState({
      "first_name": "",
      "last_name": "",
      "reg_id": "",
      "email": "",
      "password": "",
      "confpass": "",
      "is_admin": false
      
  });

  const handleChange = e => {
    const et = e.target;
    if(!!et.id) {
      setDetails({...details, [et.id]: et.value})
    }  else {
      setDetails({...details, [et.name]: et.value});
    }
  }

  const handleAdmin = e => {
    let et = e.target
    if(!!et.id) {
      setDetails({...details, [et.id]: et.checked});
    } else {
      setDetails({...details, [et.name]: et.checked});
    }
  }

  const handleSubmit = e => {
      e.preventDefault();
      if(!details.first_name || !details.last_name || !details.email || !details.password || !details.confpass || !details.reg_id) {
        enqueueSnackbar('All fields must be filled!', { variant: 'error' })
        return;
      }
      if(details.password.length < 8) {
          enqueueSnackbar('Password Length should be 8 characters', { variant: 'error' })
          return;
      }
      if (details.password !== details.confpass) {
        enqueueSnackbar('Password mismatch!', { variant: 'error' })
        return;
      }
      console.log(details);
      // Axios.post(
      //   "http://localhost:8000/register/",
      //   details,
      //   { 
      //     headers: 
      //     { 
      //       'Content-Type': 'application/json' 
      //     } 
      //   }
      // )
      // .then(res => {
      //   setUserTokenCookie(res.data.token);
      //   enqueueSnackbar('Registration successful!', { variant: 'success' })
      //   history.push('/home');
      // })
      // .catch(err => {
      //   enqueueSnackbar(err.message, { variant: 'error' });
      // })
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={8} alignContents="center" className={classes.image}>
        <Hidden smDown>
          <Typography 
            component="h1" 
            variant="h1" 
            className={classes.target}          
          >
            Target
          </Typography>
        </Hidden>
      </Grid>
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Hidden smUp>
            <WavesIcon fontSize="large"/>
            <Typography variant="h3">
              Target
            </Typography>
          </Hidden>
          <Hidden smDown>
            <Typography component="h1" variant="h3">
              Sign Up   
            </Typography>
          </Hidden>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="first_name"
              label="First name"
              name="first_name"
              autoComplete="first_name"
              value={details.first_name}
              autoFocus
              onChange={handleChange}
            /> 
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="last_name"
              label="Last name"
              name="last_name"
              autoComplete="last_name"
              value={details.last_name}
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
            <FormControlLabel
              control={<Checkbox onChange={handleAdmin} name="is_admin" color="primary" />}
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
                <Link component={RRDLink} to='/'>
                  Already have an account? Login instead
                </Link>
              </Grid>
            </Grid>
        </div>
      </Grid>
        <Fab color="secondary" aria-label="toggle" onClick={toggleTheme} className={classes.fab}>
            {dark ? <Brightness7/> : <Brightness4/>}
        </Fab>
    </Grid>
  );
}