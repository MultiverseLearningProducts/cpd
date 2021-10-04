import { Meteor } from 'meteor/meteor'
import { AccountsReact } from 'meteor/gwened:meteor-accounts-react'
import { ServiceConfiguration } from 'meteor/service-configuration'
import { fetch } from 'meteor/fetch'
import { ProfilesCollection } from '/imports/db/ProfilesCollection'
import { TagsCollection } from '/imports/db/TagsCollection'
import { createForNetwork } from '/imports/both/networkTools'
import '/imports/api/profilesPublications';
import '/imports/api/observationsPublications';
import '/imports/api/tagsPublications';
import '/imports/api/usersPublications';
import { googlePermissions } from '/imports/both/googlePermissions'
import { coachingRubric } from '/imports/both/coaching-rubric'

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
      requestPermissions: googlePermissions,
      requestOfflineToken: true,
      forceApprovalPrompt: true
    }
  }
})

Meteor.startup(() => {
  if (!ProfilesCollection.find({}).count()) {
    console.info('No HiBob Data - Fetching from HiBob...')
    Meteor.call('getNetworkData')
  }
  if(!TagsCollection.find({}).count()) {
    console.info('No tags collection. Seeding tags now...')
    Meteor.call('seedTags')
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
  seedTags() {
    coachingRubric.forEach(({label, value}) => TagsCollection.insert({label, value}))
  },
  async getGoogleCalEvents(email, resumeToken) {
    if (!Meteor.user()) return
    const {services: {google}} = Meteor.user()
    try {
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(email || google.email)}/events`
      const headers = {'Authorization': `Bearer ${resumeToken ? resumeToken : google.accessToken}`}
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
      
      console.info(`${email} ${data.items.length} calEvts`)
      return data
    } catch(err) {
      if (err.status === 'UNAUTHENTICATED') {
        const {
          services: {
            resume: {
              loginTokens
            }
          }
        } = Meteor.user()
        console.warn('UNAUTHENTICATED - expired', loginTokens)
      }
      return err
    }
  }
})
