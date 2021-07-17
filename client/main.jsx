import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';
import { AccountsReact } from 'meteor/gwened:meteor-accounts-react'
import { googlePermissions } from '/imports/both/googlePermissions'

AccountsReact.configure({
  oauth: {
    google: {
      requestPermissions: googlePermissions
    }
  }
})

Meteor.startup(() => {
  render(<App/>, document.getElementById('react-target'))
})
