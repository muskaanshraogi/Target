import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./user/Login";
import Register from "./user/Register";
import Landing from "./postauth/Landing";

export default function Routes() {
  return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/home" component={Landing} />
      </Switch>
  );
}
