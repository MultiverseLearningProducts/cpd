import { Meteor } from 'meteor/meteor'
import { ProfilesCollection } from '/imports/db/ProfilesCollection'

Meteor.publish('profiles', function publishProfiles(token) {
    if (Meteor.userId()) return ProfilesCollection.find({ 'work.department': 'Learning , Innovation & Operations' })
    return token === Meteor.settings.clientSecret ? ProfilesCollection.find({ 'work.department': 'Learning , Innovation & Operations' }) : null
})