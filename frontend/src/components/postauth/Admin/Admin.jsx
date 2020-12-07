import React from "react";
import { Grid } from "@material-ui/core";

import AllUsers from "./AllUsers";
import Subjects from "./Subjects";

export default function Admin() {
  return (
    <Grid container item spacing={1}>
      <Grid container item direction="column" xs={12} md={6} spacing={1}>
        <Grid item>
          <AllUsers />
        </Grid>
      </Grid>
      <Grid container item direction="column" xs={12} md={6} spacing={1}>
        <Subjects />
      </Grid>
    </Grid>
  );
}
