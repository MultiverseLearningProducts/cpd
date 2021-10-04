import { Meteor } from 'meteor/meteor'
import { TagsCollection } from '/imports/db/TagsCollection'

Meteor.publish('tags', function publishTags() {
    return TagsCollection.find({})
})