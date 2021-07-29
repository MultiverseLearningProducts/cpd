import { Meteor } from 'meteor/meteor'
import { AccountsReact } from 'meteor/gwened:meteor-accounts-react'
import { ServiceConfiguration } from 'meteor/service-configuration'
import { fetch } from 'meteor/fetch'
import { ProfilesCollection } from '/imports/db/ProfilesCollection'
import { ObservationsCollection } from '/imports/db/ObservationsCollection'
import { createForNetwork } from '/imports/both/networkTools'
import '/imports/api/profilesPublications';
import '/imports/api/observationsPublications';
import '/imports/api/usersPublications';
import { googlePermissions } from '/imports/both/googlePermissions'

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

AccountsReact.configure({
  oauth: {
    google: {
      requestPermissions: googlePermissions
    }
  }
})

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
  },
  async getGoogleCalEvents(email) {
    if (!Meteor.user()) return
    const {services: {google}} = Meteor.user()
    try {
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(email || google.email)}/events`
      const headers = {'Authorization': `Bearer ${google.accessToken}`}
      const params = new URLSearchParams({
        q: '(obs)',
        singleEvents: true,
        orderBy: 'startTime',
        showHiddenInvitations: true
      })
      const res = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers
      })

      const data = await res.json()
      if (data.error) throw data.error
      
      console.info(`getGoogleCalEvents: ${data.items.length} obs for ${email}`)
      return data
    } catch(err) {
      console.error(err)

      return err
    }
  },
  async getObservationsData() {
    const observations = ObservationsCollection.find({}).fetch()
    const profiles = ProfilesCollection.find({}).fetch()
    return await Promise.resolve({status: "OK"})
  }
})


const text = "You gave a nicely structured introduction to OAuth, a tricky subject for those new to programming. I could see the way you used supportive slides again. Nice one, good prep. There was little interaction as you delivered the information. You and I have both wondered that this kind of session would work better as a video or async resource. It's ok to deliver, then assess. The video format for this kind of session would then enable you to spend the time you have with your apprentices talking to them and checking for understanding."

