import { Mongo } from 'meteor/mongo'
export const ObservationsCollection = new Mongo.Collection('observations')

ObservationsCollection.allow({
    insert: () => true,
    update: () => true
})