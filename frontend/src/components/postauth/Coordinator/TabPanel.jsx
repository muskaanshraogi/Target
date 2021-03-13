import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  TableCell,
  TableRow,
  TableContainer,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  Paper,
  TableBody,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import Axios from "axios";
import { useSnackbar } from "notistack";
import PDF from "../PDF/pdfContainer";
import Doc from "../PDF/docService";
import Teachers from "./Teachers";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  backDrop: {
    backdropFilter: "blur(3px)",
    backgroundColor: "rgba(69,69,69,0.9)",
  },
  paper: {
    padding: theme.spacing(2),
    fontSize: "20px",
  },
}));

export default function CoordinatorPanel(props) {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [teachers, setTeachers] = useState([]);
  const [attainment, setAttainment] = useState(null);
  const [coordinator, setCoordinator] = useState("");
  const [subject, setSubject] = useState(null);
  const [acadYear, setAcadYear] = useState("");
  const [totalBool, setTotalBool] = useState(false);
  const [targetBool, setTargetBool] = useState(false);
  const [submittedBool, setSubmittedBool] = useState(false);
  const [totalModal, setTotalModal] = useState(false);
  const [targetModal, setTargetModal] = useState(false);
  const [total, setTotal] = useState({
    tco1: 0,
    tco2: 0,
    tco3: 0,
    tco4: 0,
    tco5: 0,
    tco6: 0,
    tsppu: 0,
  });
  const [target, setTarget] = useState({
    mt1: 0,
    mt2: 0,
    mt3: 0,
    sppu1: 0,
    sppu2: 0,
    sppu3: 0,
  });

  const handleTotalModal = () => {
    setTotalModal(!totalModal);
  };

  const handleTargetModal = () => {
    setTargetModal(!targetModal);
  };

  const handleTotal = () => {
    Axios.post(
      `${process.env.REACT_APP_HOST}/api/subject/set/total/${props.match.params.subject}/${props.match.params.acadYear}`,
      total,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then(() => {
        setTotal(total);
        setTotalBool(true);
        setTotalModal(false);
        enqueueSnackbar("Added Total Marks Successfully!", {
          variant: "success",
        });
      })
      .catch((err) => {
        enqueueSnackbar("Could Not Add Total Marks", { variant: "error" });
      });
  };

  const handleTarget = () => {
    Axios.post(
      `${process.env.REACT_APP_HOST}/api/subject/set/target/${props.match.params.subject}/${props.match.params.acadYear}`,
      target,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        setTarget(target);
        setTargetBool(true);
        setTargetModal(false);
        enqueueSnackbar("Added Target Successfully!", {
          variant: "success",
        });
      })
      .catch((err) => {
        enqueueSnackbar("Could Not Add Target", { variant: "error" });
      });
  };

  const handleTotalChange = (e) => {
    let value = e.target.value;
    setTotal({ ...total, [e.target.name]: value });
  };

  const handleTargetChange = (e) => {
    let value = e.target.value;
    setTarget({ ...target, [e.target.name]: value });
  };

  const handleCalculate = () => {
    Axios.get(
      `${process.env.REACT_APP_HOST}/api/final/calculate/${subject.subId}/${subject.acadYear}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        Axios.get(
          `${process.env.REACT_APP_HOST}/api/final/attainment/${teachers[0].subId}/${acadYear}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
            },
          }
        )
          .then((res) => {
            setAttainment(res.data.data[0]);
            enqueueSnackbar("Calculated attainment successfully", {
              variant: "success",
            });
          })
          .catch((err) => {
            setAttainment(null);
          });
      })
      .catch((err) => {
        enqueueSnackbar("Attainment has already been calculated", {
          variant: "info",
        });
      });
  };

  const getTeachers = (subId, acadYear) => {
    Axios.get(
      `${process.env.REACT_APP_HOST}/api/faculty/subject/teacher/${subId}/${acadYear}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        let data = res.data.data;
        let subCount = 0
        data.forEach((d, index) => {
          if(d.submitted) {
            subCount++
          }
        });
        setTeachers(data);
        if(subCount === 3) {
          setSubmittedBool(true)
        }
        let found = data.find((d) => d.roleName === "Subject Coordinator");
        if (found) {
          setCoordinator(found.reg_id);
        }
        setAcadYear(data[0].acadYear);
      })
      .catch((err) => {});
  };

  const getSubmitted = (subId, acadYear) => {
    Axios.get(
      `${process.env.REACT_APP_HOST}/api/marks/submit/${subId}/${acadYear}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        let data = res.data.data;
        let temp = [...teachers];
        let count = 0;
        temp.forEach((obj) => {
          let t = data.find((d) => d.division === obj.division);
          obj.submitted = t.submitted;
          if (t.submitted === 1) count++;
        });
        if (count === 3) setSubmittedBool(true);
        setTeachers(temp);
      })
      .catch((err) => {});
  };

  const getTotalMarks = (subId, acadYear) => {
    Axios.get(
      `${process.env.REACT_APP_HOST}/api/subject/get/total/${subId}/${acadYear}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        setTotal(res.data.data[0]);
        if (res.data.data[0].tco1 !== null) {
          setTotalBool(true);
        } else {
          setTotalBool(false);
        }
      })
      .catch((err) => {});
  };

  const getTargetValues = (subId, acadYear) => {
    Axios.get(
      `${process.env.REACT_APP_HOST}/api/subject/get/target/${subId}/${acadYear}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        setTarget(res.data.data[0]);
        if (res.data.data[0].mt1 !== null) {
          setTargetBool(true);
        } else {
          setTargetBool(false);
        }
      })
      .catch((err) => {});
  };

  const getAttainment = (subId, acadYear) => {
    Axios.get(
      `${process.env.REACT_APP_HOST}/api/final/attainment/${subId}/${acadYear}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        setAttainment(res.data.data[0]);
      })
      .catch((err) => {
        setAttainment(null);
      });
  };

  useEffect(() => {
    setTotal({
      tco1: 0,
      tco2: 0,
      tco3: 0,
      tco4: 0,
      tco5: 0,
      tco6: 0,
      tsppu: 0,
    });
    setTarget({
      mt1: 0,
      mt2: 0,
      mt3: 0,
      sppu1: 0,
      sppu2: 0,
      sppu3: 0,
    });
    getSubmitted(props.match.params.subject, props.match.params.acadYear);
    getTotalMarks(props.match.params.subject, props.match.params.acadYear);
    getTargetValues(props.match.params.subject, props.match.params.acadYear);
    getAttainment(props.match.params.subject, props.match.params.acadYear);
    getTeachers(props.match.params.subject, props.match.params.acadYear);
  }, [props]);

  useEffect(() => {
    Axios.get(
      `${process.env.REACT_APP_HOST}/api/subject/${
        props.match.params.subject
      }/${props.match.params.acadYear}/${
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
        console.log(res.data.data[0]);
        setSubject(res.data.data[0]);
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch my subjects", { variant: "error" });
      });
  }, [enqueueSnackbar, props]);

  const createPdf = (html) => {
    Doc.createPdf(html, `${teachers[0].subName}_report`);
  };

  return (
    <div>
      {
        subject ?
          (<Grid container item spacing={1}>
            <PDF createPdf={createPdf}>
            <div style={{ padding: '2% 2% 0 2%' }}>
            <Typography variant="h4" style={{ color: '#193B55' }}><b>Coordinator {subject.subName} : {subject.acadYear}</b></Typography>
              <Grid
                container
                spacing={1}
                style={{ paddingTop: '1px', paddingLeft: "0" }}
              >
                <Grid item xs={4}>
                  <Paper className={classes.paper}>
                    Subject ID : <b style={{ color: "#E50058" }}>{subject.subId}</b>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper className={classes.paper}>
                    Subject Name : <b style={{ color: "#E50058" }}>{subject.subName}</b>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper className={classes.paper}>
                    Academic Year : <b style={{ color: "#E50058" }}>{subject.acadYear}</b>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper className={classes.paper}>Year : {subject.year}</Paper>
                </Grid>
              </Grid>
              <Typography
                  variant="h5"
                  style={{ marginTop: "2%", padding: "1px 0", color: "#193B55" }}
                >
                  <b>Staff:</b>
              </Typography>
              <Card item xs={12}>
                <Teachers teachers={teachers} coordinator={coordinator} />
              </Card> 
              <Card  style={{ marginTop: '2%' }}>
                {total && (
                  <div>
                    <Typography variant="h6" style={{ padding: "1% 2% 0% 1%" }}>
                    Enter Total Marks:
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table aria-label="caption table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">CO 1</TableCell>
                          <TableCell align="center">CO 2</TableCell>
                          <TableCell align="center">CO 3</TableCell>
                          <TableCell align="center">CO 4</TableCell>
                          <TableCell align="center">CO 5</TableCell>
                          <TableCell align="center">CO 6</TableCell>
                          <TableCell align="center">SPPU</TableCell>
                          <TableCell align="center">Submit</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell align="center">
                            <TextField
                              name="tco1"
                              variant="filled"
                              value={total.tco1}
                              disabled={totalBool}
                              onChange={handleTotalChange}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              name="tco2"
                              variant="filled"
                              value={total.tco2}
                              disabled={totalBool}
                              onChange={handleTotalChange}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              name="tco3"
                              variant="filled"
                              value={total.tco3}
                              disabled={totalBool}
                              onChange={handleTotalChange}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              name="tco4"
                              variant="filled"
                              value={total.tco4}
                              disabled={totalBool}
                              onChange={handleTotalChange}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              name="tco5"
                              variant="filled"
                              value={total.tco5}
                              disabled={totalBool}
                              onChange={handleTotalChange}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              name="tco6"
                              variant="filled"
                              value={total.tco6}
                              disabled={totalBool}
                              onChange={handleTotalChange}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              name="tsppu"
                              variant="filled"
                              value={total.tsppu}
                              disabled={totalBool}
                              onChange={handleTotalChange}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleTotalModal}
                              disabled={totalBool}
                            >
                              Submit
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  </div>
                )}
                {target && (
                  <>
                    <Typography variant="h6" color='secondary' style={{ padding: "1% 2% 0% 1%" }}>
                      Enter Target Values:
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table aria-label="caption table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">MT 1</TableCell>
                            <TableCell align="center">MT 2</TableCell>
                            <TableCell align="center">MT 3</TableCell>
                            <TableCell align="center">SPPU 1</TableCell>
                            <TableCell align="center">SPPU 2</TableCell>
                            <TableCell align="center">SPPU 3</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell align="center">
                              <TextField
                                name="mt1"
                                variant="filled"
                                value={target.mt1}
                                disabled={targetBool}
                                onChange={handleTargetChange}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                name="mt2"
                                variant="filled"
                                value={target.mt2}
                                disabled={targetBool}
                                onChange={handleTargetChange}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                name="mt3"
                                variant="filled"
                                value={target.mt3}
                                disabled={targetBool}
                                onChange={handleTargetChange}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                name="sppu1"
                                variant="filled"
                                value={target.sppu1}
                                disabled={targetBool}
                                onChange={handleTargetChange}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                name="sppu2"
                                variant="filled"
                                value={target.sppu2}
                                disabled={targetBool}
                                onChange={handleTargetChange}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                name="sppu3"
                                variant="filled"
                                value={target.sppu3}
                                disabled={targetBool}
                                onChange={handleTargetChange}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleTargetModal}
                                disabled={targetBool}
                              >
                                Submit
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </Card>
              { attainment ? 
                (<div>
                  <Typography
                    variant="h5"
                    style={{ marginTop: "2%", padding: "1px 0", color: "#193B55" }}
                  >
                    <b>Attainment:</b>
                  </Typography>
                  <Card item xs={12}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" style={{ fontSize: '16px' }}>UT</TableCell>
                          <TableCell align="center" style={{ fontSize: '16px' }}>SPPU</TableCell>
                          <TableCell align="center" style={{ fontSize: '16px' }}>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" style={{ color: "#E50058", fontSize: '16px' }}>
                            <b>{attainment.ut}</b>
                          </TableCell>
                          <TableCell align="center" style={{ color: "#E50058", fontSize: '16px' }}>
                            <b>{attainment.sppu}</b>
                          </TableCell>
                          <TableCell align="center" style={{ color: "#E50058", fontSize: '16px' }}>
                            <b>{attainment.total}</b>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
                </div>) :
                null
              } 
              <Grid>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: "2% 2% 0% 0%" }}
                  onClick={handleCalculate}
                  disabled={!targetBool || !totalBool || !submittedBool || attainment}
                >
                  Calculate Attainment
                </Button>
              </Grid>
              </div>
            </PDF>
            <Dialog
              open={totalModal}
              onClose={handleTotalModal}
              BackdropProps={{
                classes: {
                  root: classes.backDrop,
                },
              }}
            >
              <DialogTitle id="alert-dialog-title">
                Are you sure you want to save the total marks? This step is
                irreversible.
              </DialogTitle>
              <DialogActions>
                <Button onClick={handleTotalModal} color="primary">
                  No
                </Button>
                <Button onClick={handleTotal} color="primary" autoFocus>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={targetModal}
              onClose={handleTargetModal}
              BackdropProps={{
                classes: {
                  root: classes.backDrop,
                },
              }}
            >
              <DialogTitle id="alert-dialog-title">
                Are you sure you want to save the target attainment? This step is
                irreversible.
              </DialogTitle>
              <DialogActions>
                <Button onClick={handleTargetModal} color="primary">
                  No
                </Button>
                <Button onClick={handleTarget} color="primary" autoFocus>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>) : 
          null
      }
    </div>
  );
}
