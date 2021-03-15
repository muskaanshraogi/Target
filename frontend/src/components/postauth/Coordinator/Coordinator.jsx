import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardHeader,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  makeStyles,
  TableContainer,
} from "@material-ui/core";
import { useHistory } from "react-router";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "17px",
  },
  text: {
    fontSize: "15px",
  },
  card: {
    width: "100vh",
    textTransform: "uppercase",
    color: "#193B55",
    fontWeight: "bold",
  },
}));

export default function Coordinator() {
  const classes = useStyles();
  const history = useHistory();

  const [subjects, setSubjects] = useState([]);

  const checkCoordinator = () => {
    Axios.get(
      `${process.env.REACT_APP_HOST}/api/faculty/check/coordinator/${
        JSON.parse(sessionStorage.getItem("user")).reg_id
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    ).then((res) => {
      setSubjects(res.data.data);
    });
  };

  useEffect(() => {
    checkCoordinator();
  }, []);

  const handleClick = (e) => {
    let values = e.currentTarget.value.split(",");
    history.push(`/home/coordinator/${values[0]}/${values[1]}`);
  };

  return (
    <Grid container item spacing={1}>
      {subjects.length > 0 ? (
        <Grid container item direction="column" xs={12} md={12} spacing={0}>
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
                      Year
                    </TableCell>
                    <TableCell align="center" className={classes.title}>
                      Academic Year
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subjects.map((subject, index) => (
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
                        {subject.year}
                      </TableCell>
                      <TableCell align="center" className={classes.text}>
                        {subject.acadYear}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      ) : (
        <Card>
          <CardHeader
            title={`You are not a coordinator`}
            className={classes.card}
          />
        </Card>
      )}
    </Grid>
  );
}
