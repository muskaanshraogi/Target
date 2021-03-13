import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Subjects from './Subjects.jsx'
import AllUsers from './AllUsers'

export default function Routes() {
  return (
      <Switch>
        <Route exact path="/home/admin/subjects" component={Subjects} />
        <Route path="/home/admin/staff" component={AllUsers} />
        <Redirect from="/home/admin" to="/home/admin/subjects" />
      </Switch>
  );
}
