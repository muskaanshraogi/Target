import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Grid,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Typography,
  TextField,
  ListItemText,
  Avatar,
  ListItemSecondaryAction,
  IconButton,
  makeStyles,
  colors,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSnackbar } from "notistack";
import Axios from "axios";

import EditSubject from "./EditSubject";

const useStyles = makeStyles((theme) => ({
  avatar: {
    color: theme.palette.getContrastText(colors.blue[600]),
    backgroundColor: colors.blue[600],
  },
}));

export default function Subjects() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [editSubject, setEditSubject] = useState(-1);
  const [allSubjects, setAllSubjects] = useState([]);
  const [addSubjects, setAddSubjects] = useState([
    {
      subId: "",
      subName: "",
      year: 2,
    },
  ]);

  const handleAddSubject = () => {
    setAddSubjects([...addSubjects, { subId: "", subName: "", year: "" }]);
  };

  const handleRemoveSubject = () => {
    const newAddSubjects = [...addSubjects];
    newAddSubjects.pop();
    setAddSubjects(newAddSubjects);
  };

  const handleChange = (event) => {
    let et = event.target;
    let property = event.target.name.split(" ")[0];
    let index = parseInt(event.target.name.split(" ")[1]);
    let value = et.value;
    let newAddSubjects = [...addSubjects];
    newAddSubjects[index] = { ...newAddSubjects[index], [property]: value };
    setAddSubjects(newAddSubjects);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addSubjects.forEach((subject) => {
      if (!subject.subId || !subject.subName) {
        enqueueSnackbar("Please fill all fields", { variant: "error" });
        return;
      }
    });
    if (addSubjects.length === 1) {
      if (!addSubjects[0].subId || !addSubjects[0].subName) {
        enqueueSnackbar("Please fill all fields", { variant: "error" });
        return;
      }
      Axios.post("http://localhost:8000/api/subject/add", addSubjects[0], {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      })
        .then((res) => {
          setAddSubjects([
            {
              subId: "",
              subName: "",
              year: 2,
            },
          ]);
          let newAllSubjects = [...allSubjects];
          newAllSubjects.push(addSubjects[0]);
          setAllSubjects(newAllSubjects);
          enqueueSnackbar("Added subject", { variant: "success" });
        })
        .catch((err) => {
          enqueueSnackbar("This subject already exists", { variant: "error" })
        }
        );
    } else {
      Axios.post(
        "http://localhost:8000/api/subject/add/multiple",
        {
          subjects: addSubjects,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      )
        .then((res) => {
          setAddSubjects([
            {
              subId: "",
              subName: "",
              year: 2,
            },
          ]);
          let newAllSubjects = [...allSubjects];
          addSubjects.forEach((subject) => newAllSubjects.push(subject));
          setAllSubjects(newAllSubjects);
          enqueueSnackbar("Added subjects", { variant: "success" });
        })
        .catch((err) => enqueueSnackbar("Invalid", { variant: "error" }));
    }
  };

  const handleDeleteSubject = (subId) => {
    Axios.delete(`http://localhost:8000/api/subject/delete/${subId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
      },
    }).then((res) => {
      let newAllSubjects = [...allSubjects];
      newAllSubjects = allSubjects.filter((subject) => subject.subId !== subId);
      setAllSubjects(newAllSubjects);
      enqueueSnackbar("Deleted!", { variant: "success" });
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:8000/api/subject/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
      },
    }).then((res) => setAllSubjects(res.data.data));
  }, [enqueueSnackbar]);

  return (
    <Grid item>
      <EditSubject
        editSubject={editSubject}
        setEditSubject={setEditSubject}
        allSubject={allSubjects}
        setAllSubjects={setAllSubjects}
      />
      <Card>
        <CardHeader
          title="Add Subjects"
          titleTypographyProps={{ variant: "h3" }}
        />
        <form onSubmit={handleSubmit}>
          {addSubjects.map((subject, index) => (
            <Grid container item spacing={1} style={{ padding: "1%" }}>
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
          ))}
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            style={{ margin: "0% 0% 2% 1%" }}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleAddSubject}
            style={{ margin: "0% 0% 2% 2%" }}
          >
            Add More Subjects
          </Button>
          {addSubjects.length > 1 && (
            <Button
              color="secondary"
              variant="contained"
              onClick={handleRemoveSubject}
              style={{ margin: "0% 0% 2% 2%" }}
            >
              Remove Subject
            </Button>
          )}
        </form>
      </Card>
      <Card>
        <CardHeader
          title="Subjects Added"
          titleTypographyProps={{ variant: "h3" }}
        />
        <List dense>
          {allSubjects.map((subject, index) => (
            <ListItem id={subject.subId} key={index}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  {subject.subName.charAt(0)}
                </Avatar>
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
              <ListItemSecondaryAction>
                {/* <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditSubject(index)}
                >
                  <EditIcon />
                </IconButton> */}
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteSubject(subject.subId)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Card>
    </Grid>
  );
}
