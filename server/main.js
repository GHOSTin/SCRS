import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    if(Meteor.users.find({}).count() === 0) {
        Accounts.createUser({
            password: 'Aa123456',
            username: 'admin',
            profile: { name: 'admin', status: 'active' },
            roles: ["admin"]
        });
    }
});