import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardHeader,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  Paper,

} from "@material-ui/core";
import Axios from "axios";
import { useSnackbar } from "notistack";

const division = [9, 10, 11];

export default function Subjects({ user }) {
  const { enqueueSnackbar } = useSnackbar();
  const [subjects, setSubjects] = useState([]);
  const [mySubjects, setMySubjects] = useState([]);
  const [addSubjects, setAddSubjects] = useState([
    {
      subject: "",
      role: "Subject Teacher",
      division: 9,
    },
  ]);

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
    let reg_id = JSON.parse(sessionStorage.getItem("user")).reg_id;
    if (addSubjects.length === 1) {
      Axios.post(
        `http://localhost:8000/api/faculty/add/${reg_id}`,
        addSubjects[0],
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      )
        .then((res) => {
          enqueueSnackbar("Added subject", { variant: "success" });
          let newAllSubjects = [...mySubjects];
          newAllSubjects.push(addSubjects[0]);
          setMySubjects(newAllSubjects);
          setAddSubjects([
            {
              subject: "",
              role: "Subject Teacher",
              division: 9,
            },
          ]);
        })
        .catch((err) => {
          enqueueSnackbar("Could not add subject", { variant: "error" });
        });
    } else {
      Axios.post(
        `http://localhost:8000/api/faculty/add/multiple/${reg_id}`,
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
          setAddSubjects([
            {
              subject: "",
              role: "Subject Teacher",
              division: 9,
            },
          ]);
          let newAllSubjects = [...mySubjects];
          mySubjects.forEach((subject) => mySubjects.push(subject));
          setMySubjects(newAllSubjects);
          enqueueSnackbar("Added subjects", { variant: "success" });
        })
        .catch((err) => {
          enqueueSnackbar("Could not add subjects", { variant: "error" });
        });
    }
  };

  const handleAddSubject = () => {
    setAddSubjects([
      ...addSubjects,
      { subject: "", role: "Subject Teacher", division: "" },
    ]);
  };

  const handleRemoveSubject = () => {
    const newAddSubjects = [...addSubjects];
    newAddSubjects.pop();
    setAddSubjects(newAddSubjects);
  };

  useEffect(() => {
    Axios.get("http://localhost:8000/api/subject/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Beaer ${sessionStorage.getItem("usertoken")}`,
      },
    })
      .then((res) => {
        setSubjects(res.data.data);
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch subjects", { variant: "error" });
      });
    Axios.get(
        `http://localhost:8000/api/subject/teacher/${JSON.parse(sessionStorage.getItem("user")).reg_id}`,
        {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Beaer ${sessionStorage.getItem("usertoken")}`,
            }
        }
    ).then(res => {
        setMySubjects(res.data.data);
    })
    .catch(err=> {
        enqueueSnackbar("Could not fetch my subjects", { variant: "error"})
    })
  }, [enqueueSnackbar]);

  return (
    <>
      <Grid item>
        <Card>
          <CardHeader
            title="Add Subjects you are teaching"
            titleTypographyProps={{ variant: "h4" }}
          />
          <form onSubmit={handleSubmit}>
            {addSubjects.map((subject, index) => (
              <Grid container item spacing={6}>
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
            title="Your Subjects"
            titleTypographyProps={{ variant: "h4" }}
          />
          <TableContainer component={Paper}>
      <Table aria-label="caption table" >
        <TableHead>
          <TableRow>
            <TableCell align="center">Subject ID</TableCell>
            <TableCell align="center">Subject Name</TableCell>
            <TableCell align="center">Year</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mySubjects.map((subject) => (
            <TableRow key={subject.subId}>
              <TableCell align="center">{subject.subId}</TableCell>
              <TableCell align="center">{subject.subName}</TableCell>
              <TableCell align="center">{subject.year}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </Card>
      </Grid>
    </>
  );
}
