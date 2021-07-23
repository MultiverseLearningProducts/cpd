import { Meteor } from 'meteor/meteor'
import { ObservationsCollection } from '/imports/db/ObservationsCollection'

Meteor.publish('observations', function publishObservations(calEvt_id) {
    return ObservationsCollection.find({}, { where: { calEvt_id: { $eq: calEvt_id } } })
})