import { Meteor } from 'meteor/meteor'
import { AccountsReact } from 'meteor/gwened:meteor-accounts-react'
import { ServiceConfiguration } from 'meteor/service-configuration'
import { fetch } from 'meteor/fetch'
import { ProfilesCollection } from '/imports/db/ProfilesCollection'
import { createForNetwork } from '/imports/both/networkTools'
import '/imports/api/profilesPublications';
import '/imports/api/usersPublications';

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

Meteor.startup(() => {
  if (!ProfilesCollection.find({}).count()) {
    console.info('No HiBob Data - Fetching from HiBob...')
    Meteor.call('getNetworkData')
  }
});

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
      ProfilesCollection.remove({})
      data.employees.forEach(employee => ProfilesCollection.insert(employee))
      ProfilesCollection.rawCollection().createIndex({ id: 1 }, { unique: true })
      return console.info(`Populated ProfilesCollection with ${ProfilesCollection.find().count()} records`)
    } catch (err) {
      console.error(err)
      return err;
    }
  },
  getProfiles() {
    const profiles = ProfilesCollection.find({'work.department': 'Learning , Innovation & Operations'})
    return createForNetwork(profiles)
  },
  getProfile(identifier) {
    const query = identifier.includes('@') ? {email: {$eq: identifier}} : {id: {$eq: identifier}}
    const [ profile ] = ProfilesCollection.find(query).fetch()
    return profile
  }
})

