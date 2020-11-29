import React, { useState, useEffect } from "react";
import {
  Grid,
} from "@material-ui/core";
import Axios from "axios";
import Basic from "./Basic";
import OtherDetails from "./OtherDetails";
import Subjects from "./Subjects";
import EditProfile from "./EditProfile";

export default function Teacher() {
  const [token, setToken] = useState(null);
  
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    is_admin: false,
    reg_id: "",
    division: null,
    roleName: null,
    subName: null,
    year: null,
  });

  useEffect(() => {
    setToken(sessionStorage.getItem("usertoken"));
  }, []);

  useEffect(() => {
    if (token) {
      Axios.get(
        `http://localhost:8000/api/staff/${
          JSON.parse(sessionStorage.getItem("user")).reg_id
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => {
        setUser(res.data.data[0]);
      });
    }
  }, [token]);

  return (
    <Grid container item spacing={1}>
      <Grid container item direction="column" xs={12} md={4} spacing={1}>
        <Basic user={user} />
        <OtherDetails user={user} />
        <EditProfile />
      </Grid>
      <Grid container item direction="column" xs={12} md={8} spacing={1}>
        <Subjects user={user} />
      </Grid>
    </Grid>
  );
}
