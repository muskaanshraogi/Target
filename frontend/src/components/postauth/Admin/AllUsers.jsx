import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  IconButton,
  colors,
  makeStyles,
  Grid,
  Select,
  MenuItem,
  FormControlLabel,
  Button,
  Checkbox,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Axios from "axios";
import { useSnackbar } from "notistack";

const division = [9, 10, 11];

const useStyles = makeStyles((theme) => ({
  avatar: {
    color: theme.palette.getContrastText(colors.blue[600]),
    backgroundColor: colors.blue[600],
  },
}));

export default function AllUsers() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [allUsers, setAllUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [addSubjects, setAddSubjects] = useState([
    {
      subject: "",
      role: "Subject Teacher",
      division: 9,
    },
  ]);

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
    setAddSubjects([
      ...addSubjects,
      { subject: "", role: "Subject Teacher", division: "", reg_id: "" },
    ]);
  };

  const handleRemoveSubject = () => {
    const newAddSubjects = [...addSubjects];
    newAddSubjects.pop();
    setAddSubjects(newAddSubjects);
  };

  const handleChange = (e) => {
    let et = e.target;
    let index = parseInt(et.name.split(" ")[1]);
    let property = et.name.split(" ")[0];
    let value = et.value;
    let newAddSubjects = [...addSubjects];
    newAddSubjects[index] = { ...newAddSubjects[index], [property]: value };
    setAddSubjects(newAddSubjects);
  };

  const handleChecked = (e, c) => {
    let index = parseInt(e.target.value);
    let newAddSubjects = [...addSubjects];

    if (c === true) {
      newAddSubjects[index] = {
        ...newAddSubjects[index],
        role: "Subject Coordinator",
      };
      setAddSubjects(newAddSubjects);
    } else {
      newAddSubjects[index] = {
        ...newAddSubjects[index],
        role: "Subject Teacher",
      };
      setAddSubjects(newAddSubjects);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // let admin_reg_id = JSON.parse(sessionStorage.getItem("user")).reg_id;
    if (addSubjects.length === 1) {
      Axios.post(
        `http://localhost:8000/api/faculty/add/${addSubjects[0].reg_id}`,
        addSubjects[0],
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      )
        .then((res) => {
          enqueueSnackbar("Assgined subject", { variant: "success" });
        })
        .catch((err) => {
          enqueueSnackbar("Could not assign", { variant: "error" });
        });
    } else {
      Axios.post(
        `http://localhost:8000/api/faculty/add/multiple`,
        {
          relations: addSubjects,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      )
        .then((res) => {
          enqueueSnackbar("Assgined subjects", { variant: "success" });
        })
        .catch((err) => {
          enqueueSnackbar("Could not assign", { variant: "error" });
        });
    }
  };

  useEffect(() => {
    Axios.get("http://localhost:8000/api/subject/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
      },
    })
      .then((res) => {
        setSubjects(res.data.data);
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch subjects", { variant: "error" });
      });
    Axios.get("http://localhost:8000/api/staff/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
      },
    }).then((res) => setAllUsers(res.data.data));
  }, []);

  return (
    <>
      <Card>
        <CardHeader
          title="Assign Teachers to Subjects"
          titleTypographyProps={{ variant: "h3" }}
        />
        <form onSubmit={handleSubmit}>
          {addSubjects.map((subject, index) => (
            <Grid container item spacing={3}>
              <Grid
                container
                item
                direction="column"
                xs={12}
                md={3}
                spacing={1}
              >
                <Select
                  style={{ margin: "0% 5% 0% 6%" }}
                  name={`reg_id ${index}`}
                  variant="outlined"
                  multiline
                  value={addSubjects[index].reg_id}
                  onChange={handleChange}
                  fullWidth
                >
                  {allUsers.map((staff, index) => (
                    <MenuItem key={index} value={`${staff.reg_id}`}>
                      {staff.reg_id} - {staff.firstName} {staff.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid
                container
                item
                direction="column"
                xs={12}
                md={3}
                spacing={1}
              >
                <Select
                  style={{ margin: "0% 5% 0% 6%" }}
                  name={`subject ${index}`}
                  variant="outlined"
                  multiline
                  value={addSubjects[index].subject}
                  onChange={handleChange}
                  fullWidth
                >
                  {subjects.map((subject, index) => (
                    <MenuItem key={index} value={subject.subName}>
                      {subject.subId} - {subject.subName}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid
                container
                item
                direction="column"
                xs={12}
                md={3}
                spacing={1}
              >
                <Select
                  style={{ margin: "0% 5% 0% 6%" }}
                  name={`division ${index}`}
                  variant="outlined"
                  multiline
                  value={addSubjects[index].division}
                  onChange={handleChange}
                  fullWidth
                >
                  {division.map((d, index) => (
                    <MenuItem key={index} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid
                container
                item
                direction="column"
                xs={12}
                md={3}
                spacing={1}
              >
                <FormControlLabel
                  style={{ padding: "3% 0% 0% 0%" }}
                  control={
                    <Checkbox
                      onChange={handleChecked}
                      value={index}
                      color="primary"
                    />
                  }
                  label="Subject Coordinator?"
                  labelPlacement="end"
                />
              </Grid>
            </Grid>
          ))}
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            style={{ margin: "2% 0% 2% 1%" }}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleAddSubject}
            style={{ margin: "2% 0% 2% 2%" }}
          >
            Add More Subjects
          </Button>
          {addSubjects.length > 1 && (
            <Button
              color="secondary"
              variant="contained"
              onClick={handleRemoveSubject}
              style={{ margin: "2% 0% 2% 2%" }}
            >
              Remove Subject
            </Button>
          )}
        </form>
      </Card>
      <Card>
        <CardHeader
          title="All Users on the platform"
          titleTypographyProps={{ variant: "h3" }}
        />
        <List>
          {allUsers.map((user, index) => (
            <ListItem id={index} key={index}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
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
    </>
  );
}
