import { Meteor } from 'meteor/meteor'
import { ObservationsCollection } from '/imports/db/ObservationsCollection'

Meteor.publish('observations', function publishObservations() {
    const user = Meteor.user()
    return ObservationsCollection.find({}, { where: { user_id: { $eq: user.id } } })
})