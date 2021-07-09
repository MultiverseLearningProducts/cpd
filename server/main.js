import { Meteor } from 'meteor/meteor';
import { AccountsReact } from 'meteor/gwened:meteor-accounts-react'
import { ServiceConfiguration } from 'meteor/service-configuration'
import { fetch } from 'meteor/fetch'
import { createForNetwork } from '/imports/both/networkTools'

ServiceConfiguration.configurations.upsert(
    { service: "google" },
    {
      $set: {
        "loginStyle": "popup",
        "clientId": Meteor.settings.google.clientId,
        "secret": Meteor.settings.google.clientSecret
      }
    }
)

AccountsReact.configure({})

Meteor.startup(() => {});

Meteor.methods({
  async getNetworkData() {
    try {
      const res = await fetch(`https://api.hibob.com/v1/people`, {
        method: 'GET',
        headers: {
          Authorization: Meteor.settings.hibob.accessToken,
          Accept: 'application/json'
        }
      });
      const data = await res.json();
      return createForNetwork(data)
    } catch (err) {
      console.error(err)
      return err;
    }
  }
})

