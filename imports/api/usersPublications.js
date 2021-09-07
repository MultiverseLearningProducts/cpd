import { Meteor } from 'meteor/meteor'

Meteor.publish('users', function publishUsers() {
    return Meteor.users.find({}, {
        fields: {
            'services.google.email': 1,
            'services.google.picture': 1,
            'services.google.accessToken': 1,
            'services.google.expiresAt': 1
        }
    })
})
