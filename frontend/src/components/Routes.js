import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./user/Login";
import Register from "./user/Register";
import Reset from "./user/Reset"
import ResetAck from './user/ResetAck'
import ResetPassword from './user/ResetPassword'
import Landing from "./postauth/Landing";

export default function Routes() {
  return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/reset" component={Reset} />
        <Route path="/reset_ack" component={ResetAck} />
        <Route path="/reset_password/:token" component={ResetPassword} />
        <Route path="/register" component={Register} />
        <Route path="/home" component={Landing} />
      </Switch>
  );
}
