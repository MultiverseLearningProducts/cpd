import React, { useState } from 'react';
import { GoogleUser } from './components/GoogleUser'
import { useCurrentUser } from 'react-meteor-hooks'
import { AccountsReactComponent } from 'meteor/gwened:meteor-accounts-react'
import { VisNetwork } from './components/VisNetwork'
import { version } from '/package.json'

export const Main = (props) => {
  const user = useCurrentUser()
  const {history, match} = props

  if (!user) {
    return (
      <section className="flex flex-column vh-75 justify-center items-center">
        <AccountsReactComponent history={history} route={match.path} state='signIn' />
      </section>
    )
  } else if (user && user.services) {
    return (
      <section>
        <header id="#header" className="flex justify-end items-center">
          <span className="dib mv-white mr2">v{version}</span>
          <GoogleUser user={user} />
        </header>
        <VisNetwork user={user} />
      </section>
    ) 
  } else {
    return <section></section>
  }
}
