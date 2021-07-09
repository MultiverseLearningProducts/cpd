import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Redirect } from 'react-router'
import { AccountsReact, AccountsReactComponent } from 'meteor/gwened:meteor-accounts-react'
import Main from './Main'

AccountsReact.configure({})

class Authentication extends Component {
  render () {
    const arState = this.arState

    return (
      <Switch>
        <Route exact path='/' component={arState} />
        <Route exact path='/sign-in' component={arState} />
        <Route exact path='/sign-out' component={arState} />
      </Switch>
    )
  }

  arState = ({ match, history }) => {
    const { path, params } = match

    if (Meteor.user() && path === '/') {
      return <Main />
    } else if (Meteor.user() && path === '/sign-out') {
      Meteor.logout()
      return <Redirect to='/sign-in' />
    } else if (!Meteor.user() && path !== '/sign-in') {
      return <Redirect to='/sign-in'/>
    } else if (Meteor.user() && path === '/sign-in') {
      return <Redirect to='/'/>
    } else {
      return (
        <section className="flex flex-column vh-75 justify-center items-center">
          <AccountsReactComponent history={history} route={path} state='signIn' />
        </section>
      )
    }
  }
}

export default Authentication