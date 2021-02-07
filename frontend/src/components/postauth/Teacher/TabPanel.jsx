import {
  Grid,
  Paper,
  Typography,
  makeStyles,
  Button,
  TextField,
} from "@material-ui/core";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import DataGrid, { TextEditor } from "react-data-grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    fontSize: "20px",
  },
}));

const columns = [
  { key: "roll_no", name: "Roll Number", editable: false },
  { key: "co1", name: "CO 1", editor: TextEditor, editable: true },
  { key: "co2", name: "CO 2", editor: TextEditor, editable: true },
  { key: "co3", name: "CO 3", editor: TextEditor, editable: true },
  { key: "co4", name: "CO 4", editor: TextEditor, editable: true },
  { key: "co5", name: "CO 5", editor: TextEditor, editable: true },
  { key: "co6", name: "CO 6", editor: TextEditor, editable: true },
  { key: "sppu", name: "SPPU", editor: TextEditor, editable: true },
];

export default function TabPanel({ subject }) {
  const classes = useStyles();
  let rollNumber = 1;

  const [token, setToken] = useState(null);
  const [number, setNumber] = useState(0);
  const [rows, setRows] = useState([
    {
      roll_no: rollNumber,
      co1: "",
      co2: "",
      co3: "",
      co4: "",
      co5: "",
      co6: "",
      sppu: "",
    },
  ]);

  const getMarks = () => {
    if (token) {
      Axios.get(
        `http://localhost:8000/api/marks/get/${subject.divison}/${subject.subId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const handleChange = (e) => {
    setNumber(e.target.value);
  };

  const handleAdd = () => {
    let newArray = [...rows];
    for (let i = 1; i < number; i++) {
      newArray.push({
        roll_no: ++rollNumber,
        co1: "",
        co2: "",
        co3: "",
        co4: "",
        co5: "",
        co6: "",
        sppu: "",
      });
    }
    setRows(newArray);
  };

  const handleSave = () => {
    let final = [...rows];
    final.map((row) => {
      row.roll_no = parseInt(row.roll_no);
      row.co1 = row.co1 === "" || row.co1 === "A" ? null : parseInt(row.co1);
      row.co2 = row.co2 === "" || row.co2 === "A" ? null : parseInt(row.co2);
      row.co3 = row.co3 === "" || row.co3 === "A" ? null : parseInt(row.co3);
      row.co4 = row.co4 === "" || row.co4 === "A" ? null : parseInt(row.co4);
      row.co5 = row.co5 === "" || row.co5 === "A" ? null : parseInt(row.co5);
      row.co6 = row.co6 === "" || row.co6 === "A" ? null : parseInt(row.co6);
      row.sppu =
        row.sppu === "" || row.sppu === "A" ? null : parseInt(row.sppu);
    });
    Axios.post(
      `http://localhost:8000/api/marks/add/${subject.subId}`,
      { marks: final },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = () => {};

  useEffect(() => {
    setToken(sessionStorage.getItem("usertoken"));
  }, []);

  useEffect(() => {
    getMarks();
  }, [token]);

  return (
    <div style={{ padding: "2%" }}>
      <Typography variant="h3">Subject Details</Typography>
      <Grid container spacing={1} style={{ padding: "2%", paddingLeft: "0" }}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>Subject ID : {subject.subId}</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            Subject Name : {subject.subName}
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>Year : {subject.year}</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>Divison : {subject.division}</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            Coordinator : {subject.role === 2 ? "Yes" : "No"}
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="nos"
            label={`Enter number of students in ${
              subject.year === 2 ? "SE" : subject.year === 3 ? "TE" : "BE"
            } ${subject.division}`}
            name="firstName"
            autoComplete="firstName"
            defaultValue={number}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            disabled={number === 0 ? true : false}
            variant="contained"
            color="primary"
            style={{ padding: "2%", marginTop: "5%" }}
            onClick={handleAdd}
          >
            Add Table
          </Button>
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            columns={columns}
            rows={rows}
            rowKeyGetter={(row) => row.id}
            onRowsChange={setRows}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            disabled={number === 0 ? true : false}
            variant="contained"
            color="primary"
            style={{ marginTop: "2%" }}
            onClick={handleSave}
          >
            Save marks
          </Button>
          <Button
            disabled={number === 0 ? true : false}
            variant="contained"
            color="primary"
            style={{ margin: "2% 0% 0% 2%" }}
            onClick={handleSubmit}
          >
            Submit Marks
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
