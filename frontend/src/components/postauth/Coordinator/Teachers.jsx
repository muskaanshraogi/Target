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
  makeStyles
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: "16px",
  },
}));

const Teachers = ({ teachers, coordinator }) => {

  const classes = useStyles();

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
            <TableCell align="center" style={{ color: "#193B55" }} className={classes.root}><b>Name</b></TableCell>
            <TableCell align="center" style={{ color: "#193B55" }} className={classes.root}><b>Division</b></TableCell>
            <TableCell align="center" style={{ color: "#193B55" }} className={classes.root}><b>Role</b></TableCell>
            <TableCell align="center" style={{ color: "#193B55" }} className={classes.root}><b>Email</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teachers.map((teacher, index1) => (
            <TableRow key={index1}>
              <TableCell align="center" className={classes.root}>
                {teacher.firstName} {teacher.lastName}
              </TableCell>
              <TableCell align="center" className={classes.root}>{teacher.division}</TableCell>
              <TableCell align="center" className={classes.root}>{teacher.roleName.split(" ")[1]}</TableCell>
              <TableCell align="center" className={classes.root}>
                {teacher.submitted === 0 ? (
                  <Button
                    color="primary"
                    variant="outlined"
                    component="span"
                    className={classes.root}
                    onClick={() => handleEmail(teacher.reg_id)}
                  >
                    Send Email
                  </Button>
                ) : (
                  <Typography variant="body1" className={classes.root}>Submitted</Typography>
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
