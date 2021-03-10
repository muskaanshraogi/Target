import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Teacher from "./Teacher/Teacher";
import Admin from "./Admin/Admin";
import Coordinator from "./Coordinator/Coordinator";
import TabPanel from './Teacher/TabPanel'
import CoordinatorPanel from './Coordinator/TabPanel'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => (
    <Switch>
      <Route exact path="/home/teacher" component={Teacher} />
      <Route path="/home/teacher/:subject/:acadYear" component={TabPanel} />
      <Route path="/home/admin" component={Admin} />
      <Route exact path="/home/coordinator" component={Coordinator} />
      <Route path="/home/coordinator/:subject/:acadYear" component={CoordinatorPanel} />
      <Redirect from="/home" to="/home/teacher" />
    </Switch>
);
