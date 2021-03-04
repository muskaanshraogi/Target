import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Teacher from "./Teacher/Teacher";
import Admin from "./Admin/Admin";
import Coordinator from "./Coordinator/Coordinator";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => (
  <Switch>
    <Route exact path="/home/teacher" component={Teacher} />
    <Route path="/home/admin" component={Admin} />
    <Route path="/home/coordinator" component={Coordinator} />
    <Redirect from="/home" to="/home/teacher" />
  </Switch>
);
