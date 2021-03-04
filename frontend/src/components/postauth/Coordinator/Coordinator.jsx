import React, { useState, useEffect } from "react";
import { Grid, Card, CardHeader, Tab, Tabs } from "@material-ui/core";
import Axios from "axios";
import TabPanel from "./TabPanel";

export default function Coordinator() {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState({});
  const [value, setValue] = useState(0);

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
      setSubject(res.data.data[0]);
    });
  };

  useEffect(() => {
    checkCoordinator();
  }, []);

  return (
    <Grid container item spacing={1}>
      {subjects.length > 0 ? (
        <Grid container item direction="column" xs={12} md={12} spacing={0}>
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={(e, nV) => {
              setValue(nV);
              setSubject(subjects[nV]);
            }}
          >
            {subjects.map((sub, index) => (
              <Tab label={`${sub.subName} - ${sub.acadYear}`} />
            ))}
          </Tabs>
          <TabPanel subject={subject} />
        </Grid>
      ) : (
        <Card>
          <CardHeader
            title={`You are not a coordinator`}
            titleTypographyProps={{ variant: "h4" }}
          />
        </Card>
      )}
    </Grid>
  );
}
