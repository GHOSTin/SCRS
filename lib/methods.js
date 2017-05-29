//import { check } from 'meteor/check'

Meteor.methods({
    addUser: function(userAttributes) {
        check(Meteor.userId(), String);
        check(userAttributes, {
            name: String,
            username: String,
            password: String,
            role: String
        });
        var id;

        id = Accounts.createUser({
            password: userAttributes.password,
            username: userAttributes.username,
            profile: { name: userAttributes.name, status: 'active' }
        });
        if(Meteor.isServer) {
            if (userAttributes.role.length > 0) {
                Roles.addUsersToRoles(id, userAttributes.role);
            }
            return {
                _id: id
            };
        }
    }
});