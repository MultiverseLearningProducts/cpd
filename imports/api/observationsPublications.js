import { Meteor } from 'meteor/meteor'
import { ObservationsCollection } from '/imports/db/ObservationsCollection'

Meteor.publish('observations', function publishObservations() {
    return ObservationsCollection.find({})
})