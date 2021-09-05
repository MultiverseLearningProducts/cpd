import React from 'react';
import { GoogleUser } from './components/GoogleUser'
import { useCurrentUser } from 'react-meteor-hooks'
import { AccountsReactComponent } from 'meteor/gwened:meteor-accounts-react'
import { version } from '/package.json'
import { MainContainer } from './MainContainer'
import { Provider } from 'react-redux'
import { store } from './redux'


export const Main = (props) => {
  const user = useCurrentUser()
  const {history, match} = props

  if (!user) {
    return (
      <section className="flex flex-column vh-75 justify-center items-center">
        <article className="ml-auto mr-auto mw6 lh-copy mv-white mb3">When you sign into this app with your Multiverse Google account we will pull data from HiBob and your work based Google Calendar. The observations, feedbacks, and reflections you post will be visible to all the team leads and coaches across LIO. As a member of LIO you will be able to read and browse the artifacts of continual professional development across the whole community.</article>
        <AccountsReactComponent history={history} route={match.path} state='signIn' />
        <article className="ml-auto mr-auto mw6 lh-copy mv-white mt3">If you are happy about please proceed and continue with Google.</article>
      </section>
    )
  } else if (user && user.services) {
    return (
      <section>
        <header id="#header" className="flex justify-end items-center">
          
          <span className="dib mv-white mr2">v{version}</span>
          <GoogleUser user={user} />
        </header>
        <Provider store={store}>
          <MainContainer user={user} />
        </Provider>
      </section>
    ) 
  } else {
    return <section></section>
  }
}
