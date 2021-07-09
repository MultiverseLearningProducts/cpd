import React from 'react'
import { Redirect } from 'react-router'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import { version } from '/package.json'
import { Main } from './Main'

const auth = props => {
  const { history, match } = props
  const { path } = match
  if (!Meteor.user() && path !== '/sign-in') return <Redirect to="/sign-in"/>
  if (Meteor.user() && path === '/sign-out') {
    Meteor.logout()
    return <Redirect to="/sign-in"/>
  }
  return <Main history={history} match={match} />
}

export const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={auth} />
        <Route exact path='/sign-in' component={auth} />
        <Route exact path='/sign-out' component={auth} />
      </Switch>
    </BrowserRouter>
  )
};

