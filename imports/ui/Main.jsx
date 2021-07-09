import React from 'react';
import { GoogleUser } from './components/GoogleUser'
import { useCurrentUser } from 'react-meteor-hooks'
import { AccountsReactComponent } from 'meteor/gwened:meteor-accounts-react'
import { VisNetwork } from './components/VisNetwork'

export const Main = (props) => {
  const user = useCurrentUser()
  const {history, match} = props
  if (!user) {
    return (
      <section className="flex flex-column vh-75 justify-center items-center">
        <AccountsReactComponent history={history} route={match.path} state='signIn' />
      </section>
    )
  } else {
    return (
      <>
        <header className="flex justify-end">
          <GoogleUser user={user} />
        </header>
        <main className="pa3">
          <VisNetwork/>
        </main>
      </>
    ) 
  }
}
