import { Meteor } from 'meteor/meteor'
import { ObservationsCollection } from '/imports/db/ObservationsCollection'

Meteor.publish('observations', function publishObservations(token) {
    if (Meteor.userId()) return ObservationsCollection.find({})
    return token === Meteor.settings.clientSecret ? ObservationsCollection.find({}) : null
})