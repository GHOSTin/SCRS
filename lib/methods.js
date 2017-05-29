import { Accounts } from 'meteor/accounts-base'

Meteor.methods({
    addUser: function(userAttributes) {
        check(Meteor.userId(), String);
        check(userAttributes, {
            name: String,
            username: String,
            password: String,
            role: String
        });
        let id;

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
    },
    editUser: function(userAttributes){
        check(Meteor.userId(), String);
        /*check(userAttributes, {
            name: String,
            username: String,
            role: String,
            id: String
        });*/
        Meteor.users.update(userAttributes.id, {
            $set: {
                "username": userAttributes.username,
                "profile.name": userAttributes.name,
            }
        });
        if(Meteor.isServer) {
            if (!_.isEmpty(userAttributes.password) && _.isEqual(userAttributes.password, userAttributes.password2)) {
                Accounts.setPassword(userAttributes.id, userAttributes.password);
            }
            Roles.setUserRoles(userAttributes.id, userAttributes.role);
        }
        return true;
    }
});