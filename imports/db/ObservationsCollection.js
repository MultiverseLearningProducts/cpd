import { Mongo } from 'meteor/mongo'
export const ObservationsCollection = new Mongo.Collection('observations')

ObservationsCollection.allow({
    insert: function (newObservation) {
        return Boolean(!ObservationsCollection.find({}, {
            where: {
                calEvt_id: {
                    $eq: newObservation.calEvt_id
                }
            }
        }).count())
    },
    update: () => true
})