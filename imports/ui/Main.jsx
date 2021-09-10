import React from 'react';
import { GoogleUser } from './components/misc/GoogleUser'
import { useCurrentUser } from 'react-meteor-hooks'
import { AccountsReactComponent } from 'meteor/gwened:meteor-accounts-react'
import { version } from '/package.json'
import { MainContainer } from './MainContainer'


export const Main = (props) => {
  const user = useCurrentUser()
  const {history, match} = props

  if (!user) {
    return (
      <section id="sign-in" className="flex flex-column vh-100 justify-start items-center">
        <img src="/observatory-header.svg"/>
        <article className="ml-auto mr-auto mw6 lh-copy mv-white mb4">When you sign into "The Observatory" with your Multiverse Google account we will pull data from HiBob and your work Google Calendar. The observations, feedbacks, and reflections you post will be visible to all the team leads and all the coaches across LIO.<br></br><br></br>As a member of LIO you will be able to read and browse the artifacts of continual professional development across the whole community. If you are happy about this then please proceed.</article>
        <AccountsReactComponent history={history} route={match.path} state='signIn' />
      </section>
    )
  } else if (user && user.services) {
    return (
      <section>
        <header id="#header" className="flex justify-end items-center bb b--white">
          <span className="dib flex-auto"><img src="/observatory-header.svg" alt="the observatory" style={{maxWidth: '12rem'}}className="ml3 v-mid"/></span>
          <span className="dib mv-white mr2">v{version}</span>
          <GoogleUser user={user} />
        </header>
        <MainContainer user={user} />
      </section>
    ) 
  } else {
    return <section></section>
  }
}
