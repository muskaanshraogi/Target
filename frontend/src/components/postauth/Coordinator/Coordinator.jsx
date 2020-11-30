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

  const handleCalculate = () => {
    Axios.post(
      "http://localhost:8000/api/final/calculate/:subject/:acadYear"
    )
  }

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
        console.log(res.data.data);
        setTeachers(res.data.data);
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch teachers", { variant: "error" });
      });
  }, []);
  return (
    <Grid container item spacing={1}>
      <Grid container item direction="column" xs={12} md={12} spacing={1}>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((teacher, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{teacher.subName}</TableCell>
                    <TableCell align="center">{teacher.roleName}</TableCell>
                    <TableCell align="center">{teacher.year}</TableCell>
                    <TableCell align="center">{teacher.firstName}</TableCell>
                    <TableCell align="center">{teacher.lastName}</TableCell>
                    <TableCell align="center">{teacher.division}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
      {teachers.length >= 3 && (
        <Grid>
          <Button variant="contained" color="primary" style={{margin: '2% 2% 0% 2%'}} onClick={handleCalculate}>
            Calculate Attainment
          </Button>
          <Button variant="contained" color="secondary" style={{margin: '2% 2% 0% 2%'}}>
            Find Attainment
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
