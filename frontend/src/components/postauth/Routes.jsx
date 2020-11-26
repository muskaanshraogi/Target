import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Teacher from './Teacher/Teacher';
import Admin from './Admin/Admin';

// eslint-disable-next-line import/no-anonymous-default-export
export default () => 
    <Switch>
        <Route exact path='/home/teacher' component={Teacher}/>
        <Route path='/home/admin' component={Admin}/>
        <Redirect from='/home' to='/home/teacher' />
    </Switch>