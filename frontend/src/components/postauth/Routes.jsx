import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Profile from './Profile/Profile'
import Upload from './Upload/Upload'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => 
    <Switch>
        <Route exact path='/home/upload' component={Upload}/>
        <Route path='home/profile' component={Profile}/>
        <Redirect from='/home' to='/home/upload' />
    </Switch>