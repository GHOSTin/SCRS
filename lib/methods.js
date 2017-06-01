import { Accounts } from 'meteor/accounts-base';
import { Students } from './collections/students';

Meteor.methods({
    addUser: function(userAttributes) {
        check(Meteor.userId(), String);
        check(userAttributes, {
            name: String,
            username: String,
            password: String,
            password2: String,
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
        check(userAttributes, {
            name: String,
            username: String,
            role: String,
            password: String,
            password2: String,
            id: String
        });
        Meteor.users.update(userAttributes.id, {
            $set: {
                "username": userAttributes.username,
                "profile.name": userAttributes.name,
            }
        });
        if(Meteor.isServer) {
            if (!_.isEmpty(userAttributes.password2) && _.isEqual(userAttributes.password, userAttributes.password2)) {
                Accounts.setPassword(userAttributes.id, userAttributes.password);
            }
            Roles.setUserRoles(userAttributes.id, userAttributes.role);
        }
        return true;
    },
    parseUpload( data ){
        check(data, Array);
        _.each(data, function(value, key){
            value.name = value[0];
            delete value[0];
        });
        for (let i = 0; i< data.length; i++){
            let item = data[i],
                exists = Students.findOne({name: item.name});
            if(!exists) {
                Students.insert(item);
            } else {
                if(Meteor.isClient) {
                    console.warn(`Отклонено. Студент "${item.name}" уже добавлен`);
                }
            }
        }
    }
});