import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  Card,
  CardHeader,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
  Paper,
  Button,
} from "@material-ui/core";
import Axios from "axios";
import { useHistory } from "react-router";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "17px",
  },
  text: {
    fontSize: "15px",
  },
}));

export default function Subjects({ user }) {
  const classes = useStyles();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();

  const [mySubjects, setMySubjects] = useState([]);

  useEffect(() => {
    Axios.get(
      `${process.env.REACT_APP_HOST}/api/subject/teacher/${
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
        setMySubjects(res.data.data);
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch my subjects", { variant: "error" });
      });
  }, [enqueueSnackbar]);

  const handleClick = (e) => {
    let values = e.currentTarget.value.split(",");
    history.push(`/home/teacher/${values[0]}/${values[1]}`);
  };

  return (
    <>
      {mySubjects.length ? (
        <Grid item spacing={2}>
          <Card>
            <CardHeader
              title="My Subjects"
              titleTypographyProps={{ variant: "h4" }}
            />
            <TableContainer component={Paper}>
              <Table aria-label="caption table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" className={classes.title}>
                      Subject ID
                    </TableCell>
                    <TableCell align="center" className={classes.title}>
                      Name
                    </TableCell>
                    <TableCell align="center" className={classes.title}>
                      Academic Year
                    </TableCell>
                    <TableCell align="center" className={classes.title}>
                      Year
                    </TableCell>
                    <TableCell align="center" className={classes.title}>
                      Division
                    </TableCell>
                    <TableCell align="center" className={classes.title}>
                      Role
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mySubjects.map((subject, index) => (
                    <TableRow key={subject.subId}>
                      <TableCell align="center" className={classes.text}>
                        {subject.subId}
                      </TableCell>
                      <TableCell align="center" className={classes.text}>
                        <Button
                          color="primary"
                          className={classes.button}
                          onClick={handleClick}
                          value={`${subject.subId},${subject.acadYear}`}
                        >
                          <b>{subject.subName}</b>
                        </Button>
                      </TableCell>
                      <TableCell align="center" className={classes.text}>
                        {subject.acadYear}
                      </TableCell>
                      <TableCell align="center" className={classes.text}>
                        {subject.year}
                      </TableCell>
                      <TableCell align="center" className={classes.text}>
                        {subject.division}
                      </TableCell>
                      <TableCell align="center" className={classes.text}>
                        {subject.role_id === 1 ? "Teacher" : "Coordinator"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      ) : (
        <Grid item spacing={2} style={{ marginTop: "1%" }}>
          <Paper>
            <Typography
              variant="h5"
              style={{ color: "#193B55", padding: "1%" }}
            >
              <b>No subjects assigned yet</b>
            </Typography>
          </Paper>
        </Grid>
      )}
    </>
  );
}
