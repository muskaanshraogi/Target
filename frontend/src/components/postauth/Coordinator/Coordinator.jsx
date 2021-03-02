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
import { ThemeContext } from "../../../context/useTheme";
import PDF from "../PDF/pdfContainer";
import Doc from "../PDF/docService";
import Teachers from "./Teachers";

const useStyles = makeStyles((theme) => ({
  tableDark: {
    backgroundColor: "black",
    color: "white",
  },
  tableLight: {
    backgroundColor: "grey",
    color: "white",
  },
}));

export default function Coordinator() {
  const { enqueueSnackbar } = useSnackbar();
  const [teachers, setTeachers] = useState([]);
  const [attainment, setAttainment] = useState(null);
  const [coordinator, setCoordinator] = useState("");
  const [subId, setSubID] = useState("");
  const [acadYear, setAcadYear] = useState("");
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
  const [totalBool, setTotalBool] = useState(false);
  const [targetBool, setTargetBool] = useState(false);
  const [submittedBool, setSubmittedBool] = useState(false);
  const [totalModal, setTotalModal] = useState(false);
  const [targetModal, setTargetModal] = useState(false);

  const handleTotalModal = () => {
    setTotalModal(!totalModal);
  };

  const handleTargetModal = () => {
    setTargetModal(!targetModal);
  };

  const handleTotal = () => {
    Axios.post(
      `http://localhost:8000/api/subject/set/total/${subId}/${acadYear}`,
      total,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
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
      `http://localhost:8000/api/subject/set/target/${subId}/${acadYear}`,
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
      `http://localhost:8000/api/final/calculate/${teachers[0].subId}/${acadYear}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        Axios.get(
          `http://localhost:8000/api/final/attainment/${teachers[0].subId}/${acadYear}`,
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
        enqueueSnackbar("Could not calculate attainment", { variant: "error" });
      });
  };

  const getTeachers = () => {
    Axios.get(
      `http://localhost:8000/api/faculty/subject/teacher/${
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
        let data = res.data.data;
        let temp = [];
        data.forEach((d, index) => {
          temp.push({ reg_id: d.reg_id, count: 0 });
        });
        setTeachers(data);
        let found = data.find((d) => d.roleName === "Subject Coordinator");
        if (found) {
          setCoordinator(found.reg_id);
        }
        setSubID(data[0].subId);
        setAcadYear(data[0].acadYear);
      })
      .catch((err) => {});
  };

  const getSubmitted = (subId) => {
    Axios.get(`http://localhost:8000/api/marks/submit/${subId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
      },
    })
      .then((res) => {
        let data = res.data.data;
        let temp = [...teachers];
        let count = 0;
        temp.map((obj) => {
          let t = data.find((d) => d.division === obj.division);
          obj.submitted = t.submitted;
          if (t.submitted === 1) count++;
        });
        if (count === 3) setSubmittedBool(true);
        setTeachers(temp);
      })
      .catch((err) => console.log(err));
  };

  const getTotalMarks = (subId, acadYear) => {
    Axios.get(
      `http://localhost:8000/api/subject/get/total/${subId}/${acadYear}`,
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
        }
      })
      .catch((err) => console.log(err));
  };

  const getTargetValues = (subId, acadYear) => {
    Axios.get(
      `http://localhost:8000/api/subject/get/target/${subId}/${acadYear}`,
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
        }
      })
      .catch((err) => console.log(err));
  };

  const getAttainment = (subId, acadYear) => {
    Axios.get(
      `http://localhost:8000/api/final/attainment/${subId}/${acadYear}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        console.log(res.data.data[0]);
        setAttainment(res.data.data[0]);
      })
      .catch((err) => {
        setAttainment(null);
      });
  };

  useEffect(() => {
    getTeachers();
  }, []);

  useEffect(() => {
    getSubmitted(subId, acadYear);
    getTotalMarks(subId, acadYear);
    getTargetValues(subId, acadYear);
    getAttainment(subId, acadYear);
  }, [subId, acadYear]);

  const createPdf = (html) => {
    Doc.createPdf(html, `${teachers[0].subName}_report`);
  };

  return (
    <Grid container item spacing={1}>
      <Grid container item direction="column" xs={12} md={12} spacing={1}>
        {teachers.length > 0 ? (
          <PDF createPdf={createPdf}>
            <Card>
              <CardHeader
                title={`Teachers teaching your subject`}
                titleTypographyProps={{ variant: "h4" }}
              />
              {total && (
                <>
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
                        </TableRow>
                        <TableRow>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleTotalModal}
                              disabled={totalBool}
                            >
                              Submit Total Marks
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
              {target && (
                <>
                  <Typography variant="h6" style={{ padding: "1% 2% 0% 1%" }}>
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
                        </TableRow>
                        <TableRow>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleTargetModal}
                              disabled={targetBool}
                            >
                              Submit Target Values
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
              <Teachers teachers={teachers} coordinator={coordinator} />
            </Card>
            {
              <Card
                style={{
                  margin: "2% 0% 0% 0%",
                }}
              >
                {attainment && (
                  <>
                    <CardHeader
                      title="Attaiment stats"
                      titleTypographyProps={{ variant: "h4" }}
                    />
                    <CardContent>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Academic Year</TableCell>
                            <TableCell align="center">UT</TableCell>
                            <TableCell align="center">SPPU</TableCell>
                            <TableCell align="center">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell align="center">
                              {attainment.acadYear}
                            </TableCell>
                            <TableCell align="center">
                              {attainment.ut}
                            </TableCell>
                            <TableCell align="center">
                              {attainment.sppu}
                            </TableCell>
                            <TableCell align="center">
                              {attainment.total}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </>
                )}
              </Card>
            }
            <Grid>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "2% 2% 0% 0%" }}
                onClick={handleCalculate}
                disabled={targetBool && totalBool && submittedBool}
              >
                Calculate Attainment
              </Button>
            </Grid>
          </PDF>
        ) : (
          <Card>
            <CardHeader
              title={`You are not a coordinator`}
              titleTypographyProps={{ variant: "h4" }}
            />
          </Card>
        )}
      </Grid>
      <Dialog
        open={totalModal}
        onClose={handleTotalModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
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
    </Grid>
  );
}
