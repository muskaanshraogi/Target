import React, { useState, useEffect } from "react";
import {
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
} from "@material-ui/core";
import Axios from "axios";
import { useSnackbar } from "notistack";

export default function Coordinator() {
  const { enqueueSnackbar } = useSnackbar();
  const [teachers, setTeachers] = useState([]);
  const [reports, setReports] = useState([]);
  const [attainment, setAttainment] = useState(0);

  const handleCalculate = () => {
    let date = new Date().toISOString().split("T")[0];
    date = formatDate(date);
    let acadYear = formatAcadYear(formatDate(new Date().toLocaleDateString()));
    Axios.get(
      `http://localhost:8000/api/final/calculate/${teachers[0].subId}/${acadYear}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Beaer ${sessionStorage.getItem("usertoken")}`,
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
        enqueueSnackbar("Could not calculate attainment", { variant: "error" });
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
          Authorization: `Beaer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        setTeachers(res.data.data);
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch teachers", { variant: "error" });
      });
    Axios.get(
      `http://localhost:8000/api/report/get/subject/${
        JSON.parse(sessionStorage.getItem("user")).reg_id
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Beaer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        setReports(res.data.data);
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch teachers", { variant: "error" });
      });
    Axios.get(
      `http://localhost:8000/api/final/attainment/${JSON.parse(sessionStorage.getItem("user")).reg_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Beaer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    ).then(res => {
      setAttainment(res.data.data[0].attainment);
    })
    .catch(err => {
      setAttainment(0);
    })
  }, [enqueueSnackbar]);
  return (
    <Grid container item spacing={1}>
      <Grid container item direction="column" xs={12} md={12} spacing={1}>
        {teachers.length > 0 ? (
          <>
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
                      <TableCell align="center">First Name</TableCell>
                      <TableCell align="center">Last Name</TableCell>
                      <TableCell align="center">Division</TableCell>
                      <TableCell align="center">Submitted On</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teachers.map((teacher, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{teacher.subName}</TableCell>
                        <TableCell align="center">{teacher.roleName}</TableCell>
                        <TableCell align="center">{teacher.year}</TableCell>
                        <TableCell align="center">
                          {teacher.firstName}
                        </TableCell>
                        <TableCell align="center">{teacher.lastName}</TableCell>
                        <TableCell align="center">{teacher.division}</TableCell>
                        {reports.map((report, index) =>
                          report.reg_id === teacher.reg_id ? (
                            <TableCell align="center">
                              {report.submittedOn}
                            </TableCell>
                          ) : null
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            <Grid>
            {
              attainment === 0 &&
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "2% 2% 0% 0%" }}
                onClick={handleCalculate}
                disabled={reports.length >= 3 ? false : true}
              >
                Calculate Attainment
              </Button>
            }
            </Grid>
          </>
        ) : (
          <Card>
            <CardHeader
              title={`You are not a coordinator`}
              titleTypographyProps={{ variant: "h4" }}
            />
          </Card>
        )}
      </Grid>
      <Card
        style={{
          margin: '2% 0% 0% 0%'
        }}>
        <CardHeader
          title={`Attainment for the subject is ${attainment}`}
          titleTypographyProps={{ variant: "h4" }}
        />
      </Card>
    </Grid>
  );
}
