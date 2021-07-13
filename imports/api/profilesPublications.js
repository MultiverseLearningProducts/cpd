import { Meteor } from 'meteor/meteor'
import { ProfilesCollection } from '/imports/db/ProfilesCollection'

Meteor.publish('profiles', function publishProfiles() {
    return ProfilesCollection.find({ 'work.department': 'Learning , Innovation & Operations' })
})