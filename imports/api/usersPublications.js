import { Meteor } from 'meteor/meteor'

Meteor.publish('users', function publishUsers() {
    return Meteor.users.find({}, {
        fields: {
            'services.google.email': 1,
            'services.google.picture': 1
        }
    })
})

/*
profile: {name: "Bernard Mordan"}
services:
    google:
        accessToken: "_________________"
        email: "bernard.mordan@multiverse.io"
        expiresAt: 1625848276992
        family_name: "Mordan"
        given_name: "Bernard"
        id: "100062989929952627203"
        idToken: "_________________._________________.G7J-_________________-_________________-_________________"
        locale: "en-GB"
        name: "Bernard Mordan"
        picture: "https://lh3.googleusercontent.com/a-/AOh14GgxiJCrj0DbpFY8X3tZOxa_l3sE4z8ZZgPYsElGgw=s96-c"
        scope: Array(3)
            0: "https://www.googleapis.com/auth/userinfo.email"
            1: "https://www.googleapis.com/auth/userinfo.profile"
            2: "openid"
        verified_email: true
_id: "wbmmMdEDMFgwELtgJ"
*/