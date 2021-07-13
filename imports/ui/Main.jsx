import React, { useState } from 'react';
import { GoogleUser } from './components/GoogleUser'
import { useCurrentUser } from 'react-meteor-hooks'
import { AccountsReactComponent } from 'meteor/gwened:meteor-accounts-react'
import { VisNetwork } from './components/VisNetwork'
import { PanelNav } from './components/PanelNav'
import { Profile } from './components/Profile'
import { Resources } from './components/Resources'
import { version } from '/package.json'

const panels = [
  '0px',
  `-${window.innerWidth}px`,
  `-${window.innerWidth * 2}px`
]

export const Main = (props) => {
  const user = useCurrentUser()
  const {history, match} = props
  const [panel, setPanel] = useState(0)

  if (!user) {
    return (
      <section className="flex flex-column vh-75 justify-center items-center">
        <AccountsReactComponent history={history} route={match.path} state='signIn' />
      </section>
    )
  } else if (user && user.services) {
    return (
      <section>
        <header className="flex justify-end">
          <PanelNav setPanel={setPanel} />
          <GoogleUser user={user} />
        </header>
        <main>
          <VisNetwork setPanel={setPanel} user={user} />
        </main>
      </section>
    ) 
  } else {
    return <section></section>
  }
}
