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
  button: {
    margin : theme.spacing(2,1,1,0)
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
      "firstName": "",
      "lastName": "",
      "reg_id": "",
      "email": "",
      "password": "",
      "confpass": "",
      "mobile": [''],
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

  const handleMobile = (event) => {
    let newMobile = [...details.mobile];
    newMobile[parseInt(event.target.id)] = parseInt(event.target.value);
    setDetails({...details, mobile: newMobile});
  }

  const handleAdd = () => setDetails({...details, mobile: [...details.mobile, ['']]});

  const handleRemove = () => setDetails({...details, mobile: details.mobile.slice(0, details.mobile.length - 1)});

  const handleSubmit = e => {
      e.preventDefault();
      if(!details.firstName || !details.lastName || !details.email || !details.password || !details.confpass || !details.reg_id) {
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
      if(details.mobile[0] === '') {
        enqueueSnackbar('1 Phone numer is mandatory!', {variant: 'error'})
        return;
      }
      Axios.post(
        "http://localhost:8000/api/staff/register",
        details,
        { 
          headers: 
          { 
            'Content-Type': 'application/json' 
          } 
        }
      )
      .then(res => {
        let cookie = res.data.data.token;
        setUserTokenCookie(cookie);
        sessionStorage.setItem("user", JSON.stringify(res.data.data.user));
        enqueueSnackbar('Login Successful', { variant: 'success'});
        history.push('/home');
      })
      .catch(err => {
        enqueueSnackbar('Already Registered!', { variant: 'error' });
      })
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
            {
              details.mobile.map((m, index) => (
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required={ index === 0 ? true : false}
                    name={index}
                    label={`Enter mobile number ${index+1}`}
                    type="text"
                    id={index}
                    defaultValue={m}
                    autoComplete="mobile"
                    onChange={handleMobile}
                  />
              ))
            }
            { details.mobile.length < 3 &&
              <Button 
                className={classes.button}
                color="secondary"
                variant="contained"
                onClick={handleAdd}>Add Mobile Number
              </Button>
            }
            { details.mobile.length > 1 &&
                <Button 
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={handleRemove}>Remove Mobile Number
                </Button>
            }
            <br/>
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