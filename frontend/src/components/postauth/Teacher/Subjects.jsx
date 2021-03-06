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
  Paper,
  Tabs,
  Tab,
} from "@material-ui/core";
import Axios from "axios";
import { useSnackbar } from "notistack";
import TabPanel from "./TabPanel";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '17px'
  },
  text: {
    fontSize: '15px'
  }
}));

export default function Subjects({ user }) {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [value, setValue] = useState(0);
  const [mySubjects, setMySubjects] = useState([]);
  const [subject, setSubject] = useState({});

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
        setSubject(res.data.data[0]);
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch my subjects", { variant: "error" });
      });
  }, [enqueueSnackbar]);

  return (
    <>
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
                  <TableCell align="center" className={classes.title}>Subject ID</TableCell>
                  <TableCell align="center" className={classes.title}>Subject Name</TableCell>
                  <TableCell align="center" className={classes.title}>Year</TableCell>
                  <TableCell align="center" className={classes.title}>Division</TableCell>
                  <TableCell align="center" className={classes.title}>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mySubjects.map((subject, index) => (
                  <TableRow key={subject.subId}>
                    <TableCell align="center" className={classes.text}>{subject.subId}</TableCell>
                    <TableCell align="center" className={classes.text}>{subject.subName}</TableCell>
                    <TableCell align="center" className={classes.text}>{subject.year}</TableCell>
                    <TableCell align="center" className={classes.text}>{subject.division}</TableCell>
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
      {subject && (
        <Grid item>
          <Card>
            <Tabs
              value={value}
              onChange={(e, nV) => {
                setValue(nV);
                setSubject(mySubjects[nV]);
              }}
            >
              {mySubjects.map((sub, index) => (
                <Tab label={`${sub.subName} - ${sub.acadYear}`} />
              ))}
            </Tabs>
            <TabPanel subject={subject} />
          </Card>
        </Grid>
      )}
    </>
  );
}
