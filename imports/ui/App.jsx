import React from 'react'
import { Redirect } from 'react-router'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Main } from './Main'
import { Help } from './components/misc/Help.jsx'

Meteor.subscribe('users')

const auth = props => {
  const { history, match } = props
  const { path } = match
  if (!Meteor.user() && path !== '/sign-in') return <Redirect to="/sign-in"/>
  if (Meteor.user() && path === '/sign-out') {
    Meteor.logout(err => {
      err ? console.error(err) : window.location.replace(window.location.origin)
    })
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
        <Route exact path='/help' component={Help} />
      </Switch>
    </BrowserRouter>
  )
};

