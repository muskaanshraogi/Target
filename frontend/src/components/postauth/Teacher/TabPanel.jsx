import {
  Grid,
  Paper,
  Typography,
  makeStyles,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TableContainer,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from "@material-ui/core";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import DataGrid, { TextEditor } from "react-data-grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    fontSize: "20px",
  },
  backDrop: {
    backdropFilter: "blur(3px)",
    backgroundColor: "rgba(69,69,69,0.9)",
  },
}));

export default function TabPanel(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [token, setToken] = useState(null);
  const [table, setTable] = useState(true);
  const [text, setText] = useState(false);
  const [number, setNumber] = useState(0);
  const [sub, setSub] = useState(null);
  let [rollNumber, setRollNumber] = useState("");
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const columns = [
    { key: "roll_no", name: "Roll Number", editable: false },
    { key: "co1", name: "CO 1", editor: TextEditor, editable: !submitted },
    { key: "co2", name: "CO 2", editor: TextEditor, editable: !submitted },
    { key: "co3", name: "CO 3", editor: TextEditor, editable: !submitted },
    { key: "co4", name: "CO 4", editor: TextEditor, editable: !submitted },
    { key: "co5", name: "CO 5", editor: TextEditor, editable: !submitted },
    { key: "co6", name: "CO 6", editor: TextEditor, editable: !submitted },
    { key: "sppu", name: "SPPU", editor: TextEditor, editable: !submitted },
  ];

  const generateRoll = (div, year) => {
    let roll = "";

    if (year === 2) roll = "2";
    else if (year === 3) roll = "3";
    else if (year === 4) roll = "4";

    roll += "3";

    if (div === 9) roll += "1";
    else if (div === 10) roll += "2";
    else if (div === 11) roll += "3";

    roll += "01";

    return roll;
  };

  const getMarks = (sub) => {
    if (token) {
      let final = "";
      let div = sub.division;
      if (div === 9) {
        div = "09";
      }
      if (parseInt(sub.year) === 2) final += "SE" + div;
      else if (parseInt(sub.year) === 3) final += "TE" + div;
      else final += "BE" + div;
      Axios.get(
        `${process.env.REACT_APP_HOST}/api/marks/get/${final}/${sub.subId}/${sub.acadYear}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          if (res.data.data.length > 0) {
            setNumber(res.data.data.length);
            setText(true);
            setTable(true);
            setRows(res.data.data);
          }
        })
        .catch((err) => {});
      Axios.get(
        `${process.env.REACT_APP_HOST}/api/marks/submit/${sub.subId}/${sub.division}/${sub.acadYear}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          if (res.data.data[0].submitted === 1) {
            setSubmitted(true);
          }
        })
        .catch((err) => {});
    }
  };

  const handleChange = (e) => {
    setNumber(e.target.value);
    if (parseInt(e.target.value) > 0) setTable(false);
  };

  const handleAdd = () => {
    let newArray = [...rows];
    let startIndex =
      rows[rows.length - 1] === undefined ? 0 : rows[rows.length - 1];
    let endIndex = startIndex + number;
    for (let i = startIndex; i < endIndex; i++) {
      newArray.push({
        roll_no: rollNumber++,
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
    setTable(true);
  };

  const handleSave = () => {
    let final = [...rows];
    final.map((row) => {
      row.roll_no = parseInt(row.roll_no);
      row.co1 =
        row.co1 === "" || row.co1 === "A" || row.co1 === "FF"
          ? null
          : parseInt(row.co1);
      row.co2 =
        row.co2 === "" || row.co2 === "A" || row.co2 === "FF"
          ? null
          : parseInt(row.co2);
      row.co3 =
        row.co3 === "" || row.co3 === "A" || row.co3 === "FF"
          ? null
          : parseInt(row.co3);
      row.co4 =
        row.co4 === "" || row.co4 === "A" || row.co4 === "FF"
          ? null
          : parseInt(row.co4);
      row.co5 =
        row.co5 === "" || row.co5 === "A" || row.co5 === "FF"
          ? null
          : parseInt(row.co5);
      row.co6 =
        row.co6 === "" || row.co6 === "A" || row.co6 === "FF"
          ? null
          : parseInt(row.co6);
      row.sppu =
        row.sppu === "" || row.sppu === "A" || row.sppu === "FF"
          ? null
          : parseInt(row.sppu);
    });
    Axios.post(
      `${process.env.REACT_APP_HOST}/api/marks/add/${props.match.params.subject}/${props.match.params.acadYear}`,
      { marks: final },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(() => {
        enqueueSnackbar("Saved and Updated Your Entries", {
          variant: "success",
        });
      })
      .catch((err) => {
        enqueueSnackbar("Could Not Save Your Data", { variant: "error" });
      });
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleSubmit = () => {
    let final = [...rows];
    final.map((row) => {
      row.roll_no = parseInt(row.roll_no);
      row.co1 =
        row.co1 === "" || row.co1 === "A" || row.co1 === "FF"
          ? null
          : parseInt(row.co1);
      row.co2 =
        row.co2 === "" || row.co2 === "A" || row.co2 === "FF"
          ? null
          : parseInt(row.co2);
      row.co3 =
        row.co3 === "" || row.co3 === "A" || row.co3 === "FF"
          ? null
          : parseInt(row.co3);
      row.co4 =
        row.co4 === "" || row.co4 === "A" || row.co4 === "FF"
          ? null
          : parseInt(row.co4);
      row.co5 =
        row.co5 === "" || row.co5 === "A" || row.co5 === "FF"
          ? null
          : parseInt(row.co5);
      row.co6 =
        row.co6 === "" || row.co6 === "A" || row.co6 === "FF"
          ? null
          : parseInt(row.co6);
      row.sppu =
        row.sppu === "" || row.sppu === "A" || row.sppu === "FF"
          ? null
          : parseInt(row.sppu);
    });
    Axios.post(
      `${process.env.REACT_APP_HOST}/api/marks/submit/${sub.subId}/${sub.division}/${sub.acadYear}`,
      { marks: final },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((r) => {
        enqueueSnackbar("Submitted Data Successfully", { variant: "success" });
        setOpen(!open);
        setText(true);
        setTable(true);
        setSubmitted(true);
      })
      .catch(() => {
        enqueueSnackbar("Could Not Submit Your Data", { variant: "error" });
      });
  };

  useEffect(() => {
    Axios.get(
      `${process.env.REACT_APP_HOST}/api/subject/${props.match.params.subject}/${props.match.params.acadYear}/${
        JSON.parse(sessionStorage.getItem("user")).reg_id
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        console.log(res.data.data[0])
        setSub(res.data.data[0]);
        setRollNumber(
          generateRoll(parseInt(res.data.data[0].division), parseInt(res.data.data[0].year))
        );
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch my subjects", { variant: "error" });
      });

    setToken(sessionStorage.getItem("usertoken"));
  }, [enqueueSnackbar, props]);

  useEffect(() => {
    setRows([]);
    setNumber(0);
    setText(false);
    setSubmitted(false);
    getMarks(sub);
  }, [sub]);

  return (
    <div>
      {
        sub &&
        (<div style={{ padding: "2%" }}>
        <Grid container spacing={1} style={{ padding: "2%", paddingLeft: "0" }}>
          <Grid item xs={6}>
            <Paper className={classes.paper}>Subject ID : <b style={{ color: '#E50058'}}>{sub.subId}</b></Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              Subject Name : <b style={{ color: '#E50058'}}>{sub.subName}</b>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>Year : {sub.year}</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>Divison : {sub.division}</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              Coordinator : {parseInt(sub.role_id) === 2 ? "Yes" : "No"}
            </Paper>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '2%' }}>
            <Typography variant='h5' style={{ padding: '1px 0', color: '#193B55'}}><b>Marks Distribution:</b></Typography>
            <TableContainer component={Paper}>
              <Table aria-label="caption table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ color: '#193B55' }}><b>CO 1</b></TableCell>
                    <TableCell align="center" style={{ color: '#193B55' }}><b>CO 2</b></TableCell>
                    <TableCell align="center" style={{ color: '#193B55' }}><b>CO 3</b></TableCell>
                    <TableCell align="center" style={{ color: '#193B55' }}><b>CO 4</b></TableCell>
                    <TableCell align="center" style={{ color: '#193B55' }}><b>CO 5</b></TableCell>
                    <TableCell align="center" style={{ color: '#193B55' }}><b>CO 6</b></TableCell>
                    <TableCell align="center" style={{ color: '#193B55' }}><b>SPPU</b></TableCell>
                  </TableRow>
                </TableHead>
                {!sub.tco1 ? (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center">N/A</TableCell>
                      <TableCell align="center">N/A</TableCell>
                      <TableCell align="center">N/A</TableCell>
                      <TableCell align="center">N/A</TableCell>
                      <TableCell align="center">N/A</TableCell>
                      <TableCell align="center">N/A</TableCell>
                      <TableCell align="center">N/A</TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center">{sub.tco1}</TableCell>
                      <TableCell align="center">{sub.tco2}</TableCell>
                      <TableCell align="center">{sub.tco3}</TableCell>
                      <TableCell align="center">{sub.tco4}</TableCell>
                      <TableCell align="center">{sub.tco5}</TableCell>
                      <TableCell align="center">{sub.tco6}</TableCell>
                      <TableCell align="center">{sub.tsppu}</TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={8} style={{ marginTop: '3%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="nos"
              label={`Enter number of students in ${
                sub.year === 2 ? "SE" : sub.year === 3 ? "TE" : "BE"
              } ${sub.division}`}
              name="students"
              autoComplete="students"
              value={number}
              disabled={text}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4} style={{ marginTop: '3%' }}>
            <Button
              disabled={table}
              variant="contained"
              color="primary"
              style={{ padding: "2%", marginTop: "5%" }}
              onClick={handleAdd}
            >
              Add Table
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">
              Enter marks here: {submitted ? "(Marks have been submitted)" : ""}
            </Typography>
            <DataGrid
              columns={columns}
              rows={rows}
              rowKeyGetter={(row) => row.id}
              onRowsChange={setRows}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={number === 0 || submitted ? true : false}
              variant="contained"
              color="primary"
              style={{ marginTop: "2%" }}
              onClick={handleSave}
            >
              Save marks
            </Button>
            <Button
              disabled={number === 0 || submitted ? true : false}
              variant="contained"
              color="primary"
              style={{ margin: "2% 0% 0% 1%" }}
              onClick={handleOpen}
            >
              Submit Marks
            </Button>
          </Grid>
        </Grid>
        <Dialog
          open={open}
          onClose={handleOpen}
          BackdropProps={{
            classes: {
              root: classes.backDrop,
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">{"Save your data?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to submit the marks? This step is
              irreversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOpen} color="primary">
              No
            </Button>
            <Button onClick={handleSubmit} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>)
      }
    </div>
  );
}
