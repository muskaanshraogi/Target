import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Subjects from "./Subjects.jsx";
import AllUsers from "./AllUsers";
import User from "./User";
import Subject from "./Subject";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/home/admin/subjects" component={Subjects} />
      <Route exact path="/home/admin/staff" component={AllUsers} />
      <Route path="/home/admin/staff/:reg_id" component={User} />
      <Route path="/home/admin/subjects/:subId/:acadYear" component={Subject} />
      <Redirect from="/home/admin" to="/home/admin/subjects" />
    </Switch>
  );
}
