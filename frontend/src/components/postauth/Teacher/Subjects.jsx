import React, { useState, useEffect } from "react";
import {
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

export default function Subjects({ user }) {
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
            title="Your Subjects"
            titleTypographyProps={{ variant: "h3" }}
          />
          <TableContainer component={Paper}>
            <Table aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Subject ID</TableCell>
                  <TableCell align="center">Subject Name</TableCell>
                  <TableCell align="center">Year</TableCell>
                  <TableCell align="center">Division</TableCell>
                  <TableCell align="center">Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mySubjects.map((subject, index) => (
                  <TableRow key={subject.subId}>
                    <TableCell align="center">{subject.subId}</TableCell>
                    <TableCell align="center">{subject.subName}</TableCell>
                    <TableCell align="center">{subject.year}</TableCell>
                    <TableCell align="center">{subject.division}</TableCell>
                    <TableCell align="center">
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
