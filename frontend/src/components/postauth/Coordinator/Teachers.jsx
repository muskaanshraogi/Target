import React from "react";
import {
  TableCell,
  TableRow,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableBody,
  Button,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import Axios from "axios";

const Teachers = ({ teachers, coordinator }) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleEmail = (reg_id) => {
    Axios.post(
      `${process.env.REACT_APP_HOST}/api/faculty/email/${reg_id}/${coordinator}`,
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
  return (
    <TableContainer component={Paper}>
      <Table aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Subject Name</TableCell>
            <TableCell align="center">Role</TableCell>
            <TableCell align="center">Year</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Division</TableCell>
            <TableCell align="center">Email</TableCell>
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
              <TableCell align="center">
                {teacher.submitted === 0 ? (
                  <Button
                    color="primary"
                    variant="outlined"
                    component="span"
                    onClick={() => handleEmail(teacher.reg_id)}
                  >
                    Send Email
                  </Button>
                ) : (
                  <Typography variant="body1">Submiited</Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Teachers;
