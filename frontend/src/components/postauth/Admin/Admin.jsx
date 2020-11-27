import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  List,
  ListItem,
  Avatar,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Typography,
  ListItemSecondaryAction,
  TextField,
  Button,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Axios from "axios";
import { useSnackbar } from "notistack";

export default function Admin() {
  const { enqueueSnackbar } = useSnackbar();
  const [allUsers, setAllUsers] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [addSubjects, setAddSubjects] = useState([{
    subId: '',
    subName: '',
    year: 2
  }]);

  const handleEdit = () => {};

  const handleDeleteUser = (reg_id) => {
    Axios.delete(`http://localhost:8000/api/staff/delete/${reg_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
      },
    }).then((res) => {
      let newAllUsers = [...allUsers];
      newAllUsers = allUsers.filter((user) => user.reg_id !== reg_id);
      setAllUsers(newAllUsers);
      enqueueSnackbar("Deleted!", { variant: "success" });
    });
  };

  const handleAddSubject = () => {
    setAddSubjects([...addSubjects, {subId: '', subName: '', year: ''}])
  }

  const handleRemoveSubject = () => {
    const newAddSubjects = [...addSubjects];
    newAddSubjects.pop();
    setAddSubjects(newAddSubjects);
  }

  const handleChange = (event) => {
    let et = event.target
    let property = event.target.name.split(' ')[0]
    let index = parseInt(event.target.name.split(' ')[1])
    let value = et.value
    let newAddSubjects = [...addSubjects]
    newAddSubjects[index] = {...newAddSubjects[index], [property]: value}
    setAddSubjects(newAddSubjects);
  }

  const handleSubmit = event => {
    event.preventDefault();
    if(addSubjects.length === 1) {
      Axios.post(
        'http://localhost:8000/api/subject/add',
        addSubjects[0],
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem("usertoken")}`,
          }
        }
      )
      .then(res => {
          enqueueSnackbar('Added subject', {variant:'success'})
          let newAllSubjects = [...allSubjects]
          newAllSubjects.push(addSubjects[0])
          setAllSubjects(newAllSubjects);
      })
      .catch(err => enqueueSnackbar('This subject already exists', {variant: 'error'}))
    } else {
      Axios.post(
        'http://localhost:8000/api/subject/add/multiple',
        addSubjects,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem("usertoken")}`,
          }
        }
      )
      .then(res => console.log(res))
      .catch(err => enqueueSnackbar('Invalid', {variant: 'error'}))
    }
  }
  
  useEffect(() => {
    Axios.get("http://localhost:8000/api/staff/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
      },
    }).then((res) => setAllUsers(res.data.data));

    Axios.get("http://localhost:8000/api/subject/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
      },
    }).then((res) => setAllSubjects(res.data.data));
  }, [enqueueSnackbar]);

  return (
    <Grid container item spacing={1}>
      <Grid container item direction="column" xs={12} md={5} spacing={1}>
        <Grid item>
          <Card>
            <CardHeader
              title="All Users on the platform"
              titleTypographyProps={{ variant: "h3" }}
            />
            <List>
              {allUsers &&
                allUsers.map((user, index) => (
                  <ListItem id={index} key={index}>
                    <ListItemAvatar>
                      <Avatar>
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6" color="textPrimary">
                          {user.firstName} {user.lastName}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body1" color="textPrimary">
                            {user.reg_id}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {user.email}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteUser(user.reg_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          </Card>
        </Grid>
      </Grid>
      <Grid container item direction="column" xs={12} md={7} spacing={1}>
        <Grid item>
          <Card>
            <CardHeader
              title="Add Subjects"
              titleTypographyProps={{ variant: "h3" }}
            />
            <form onSubmit={handleSubmit}>
            {
              addSubjects.map((subject, index) => (
                <Grid container item spacing={2} style={{padding:'1%'}}>
                  <Grid item>
                  <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  defaultValue={subject.subName}
                  label="Enter Subject Name"
                  name={"subName " + index}
                  autoComplete="subName"
                  onChange={handleChange}
                  autoFocus
                />
                </Grid>
                <Grid item>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    defaultValue={subject.subId}
                    label="Enter Subject ID"
                    name={"subId " + index}
                    onChange={handleChange}
                    autoComplete="subID"
                    />
                </Grid>
                <Grid item>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    defaultValue={subject.year}
                    label="Enter year"
                    name={"year " + index}
                    onChange={handleChange}
                    autoComplete="year"
                    />
                  </Grid>              
                </Grid>
              ))
            }            
						<Button 
              color="primary" 
              variant="contained" 
              onClick={handleSubmit}
              style={{margin: '0% 0% 2% 2%'}}
            >
                Submit
            </Button>
            <Button 
              color="secondary" 
              variant="contained" 
              onClick={handleAddSubject}
              style={{margin: '0% 0% 2% 2%'}}
            >
                Add More Subjects
            </Button>          
            {
              addSubjects.length > 1 &&
              <Button 
                color="secondary" 
                variant="contained" 
                onClick={handleRemoveSubject}
                style={{margin: '0% 0% 2% 2%'}}
              >
                  Remove Subject
              </Button>
            }      
            </form>
          </Card>
       	  <Card>
            <CardHeader
              title="Subjects Added"
              titleTypographyProps={{ variant: "h3" }}
            />
            <List dense>
              {allSubjects.map((subject, index) => (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>{subject.subName.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h6" color="textPrimary">
                        {subject.subName}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography variant="body1" color="textPrimary">
                          {subject.subId}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Year : {subject.year}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}
