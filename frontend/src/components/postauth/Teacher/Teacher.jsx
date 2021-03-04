import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Axios from "axios";
import Subjects from "./Subjects";

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
        `${process.env.REACT_APP_HOST}/api/staff/${
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
      <Grid container item direction="column" xs={12} spacing={1}>
        <Subjects user={user} />
      </Grid>
    </Grid>
  );
}
