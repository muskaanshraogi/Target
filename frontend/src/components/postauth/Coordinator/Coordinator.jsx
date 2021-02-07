import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  TableCell,
  TableRow,
  TableContainer,
  Card,
  CardHeader,
  Table,
  TableHead,
  Paper,
  TableBody,
  Button,
  CardContent,
} from "@material-ui/core";
import Axios from "axios";
import { useSnackbar } from "notistack";
import { ThemeContext } from "../../../context/useTheme";
import PDF from "../PDF/pdfContainer";
import Doc from "../PDF/docService";

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
  const classes = useStyles();
  const { dark } = React.useContext(ThemeContext);
  const { enqueueSnackbar } = useSnackbar();
  const [teachers, setTeachers] = useState([]);
  const [reports, setReports] = useState([]);
  const [flags, setFlags] = useState([]);
  const [attainment, setAttainment] = useState({ details: [] }, { final: {} });
  const [coordinator, setCoordinator] = useState("");

  const handleCalculate = () => {
    let acadYear = formatAcadYear(formatDate(new Date().toLocaleDateString()));
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
          `http://localhost:8000/api/final/attainment/${
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
            setAttainment(res.data.data);
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

  const handleEmail = (reg_id) => {
    Axios.post(
      `http://localhost:8000/api/faculty/email/${reg_id}/${coordinator}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        enqueueSnackbar("Email sent!", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Could not send email", { variant: "error" });
      });
  };
  const formatDate = (date) => {
    date = date.replace("/", "-");
    date = date.replace("/", "-");
    return date;
  };

  const formatAcadYear = (date) => {
    let year = date.split("-").pop();
    let next = parseInt(year) + 1;
    let last = next.toString().slice(2, 4);
    return `${year}-${last}`;
  };

  useEffect(() => {
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
        setFlags(temp);
        setTeachers(data);
        let found = data.find((d) => d.roleName === "Subject Coordinator");
        if (found) {
          setCoordinator(found.reg_id);
        }
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch teachers", { variant: "error" });
      });
  }, [enqueueSnackbar]);

  const createPdf = (html) => {
    Doc.createPdf(html, `${teachers[0].subName}_report`);
  };

  useEffect(() => {
    Axios.get(
      `http://localhost:8000/api/report/get/subject/${
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
        let temp = teachers.map((t) => ({
          reg_id: t.reg_id,
          count: data.some((d) => t.reg_id === d.reg_id) ? 1 : 0,
        }));
        setFlags(temp);
        setReports(res.data.data);
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch teachers", { variant: "error" });
      });
    Axios.get(
      `http://localhost:8000/api/final/attainment/${
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
        setAttainment(res.data.data);
      })
      .catch((err) => {
        setAttainment(null);
      });
  }, [teachers, enqueueSnackbar]);

  return (
    <Grid container item spacing={1}>
      <Grid container item direction="column" xs={12} md={12} spacing={1}>
        {teachers.length > 0 && flags.length > 0 ? (
          <PDF createPdf={createPdf}>
            <Card>
              <CardHeader
                title={`Teachers teaching your subject`}
                titleTypographyProps={{ variant: "h4" }}
              />
              <TableContainer component={Paper}>
                <Table aria-label="caption table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Subject Name</TableCell>
                      <TableCell align="center">Role</TableCell>
                      <TableCell align="center">Year</TableCell>
                      <TableCell align="center">Name</TableCell>
                      <TableCell align="center">Division</TableCell>
                      <TableCell align="center">Submitted On</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teachers.map((teacher, index1) => (
                      <TableRow key={index1}>
                        <TableCell align="center">{teacher.subName}</TableCell>
                        <TableCell align="center">{teacher.roleName}</TableCell>
                        <TableCell align="center">{teacher.year}</TableCell>
                        <TableCell align="center">
                          {teacher.firstName} {teacher.lastName}
                        </TableCell>
                        <TableCell align="center">{teacher.division}</TableCell>
                        {reports.some(
                          (report) => report.reg_id === teacher.reg_id
                        ) ? (
                          <TableCell align="center">
                            {reports
                              .find(
                                (report) => report.reg_id === teacher.reg_id
                              )
                              .submittedOn.slice(0, 10)}
                          </TableCell>
                        ) : flags[index1].count === 0 ? (
                          <TableCell align="center">
                            <Button
                              color="primary"
                              variant="outlined"
                              component="span"
                              onClick={() => handleEmail(teacher.reg_id)}
                            >
                              Send Email
                            </Button>
                          </TableCell>
                        ) : null}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            {
              <Card
                style={{
                  margin: "2% 0% 0% 0%",
                }}
              >
                {attainment.details.length === 3 && attainment.final && (
                  <>
                    <CardHeader
                      title="Attaiment stats"
                      titleTypographyProps={{ variant: "h4" }}
                    />
                    <CardContent>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Division</TableCell>
                            <TableCell align="center">UT</TableCell>
                            <TableCell align="center">SPPU</TableCell>
                            <TableCell align="center">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {attainment.details.map((att, index) => (
                            <TableRow key={index}>
                              <TableCell align="center">
                                {att.division}
                              </TableCell>
                              <TableCell align="center">{att.ut}</TableCell>
                              <TableCell align="center">{att.sppu}</TableCell>
                              <TableCell align="center">{att.total}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow
                            className={
                              dark ? classes.tableDark : classes.tableLight
                            }
                          >
                            <TableCell align="center">Total</TableCell>
                            <TableCell align="center">
                              {attainment.final.ut}
                            </TableCell>
                            <TableCell align="center">
                              {attainment.final.sppu}
                            </TableCell>
                            <TableCell align="center">
                              {attainment.final.total}
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
                disabled={
                  reports.length >= 3 &&
                  !(attainment.details && attainment.final)
                    ? false
                    : true
                }
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
    </Grid>
  );
}
