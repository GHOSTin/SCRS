import { Accounts } from 'meteor/accounts-base';
import { Students } from '/lib/collections/students';
import { Professions } from '/lib/collections/professions';
import { Profession2Student } from '/lib/collections/Profession2Student'
import { Journal } from '/lib/collections/journal'

Meteor.methods({
    addUser: function(userAttributes) {
        check(Meteor.userId(), String);
        check(userAttributes, {
            name: String,
            username: String,
            email: String,
            password: String,
            password2: String,
            role: String,
            status: Match.Any,
        });
        if(Meteor.isServer) {
            let id;

            id = Accounts.createUser({
                password: userAttributes.password,
                username: userAttributes.username,
                email: userAttributes.email,
                profile: {
                    name: userAttributes.name,
                    status: userAttributes.status,
                    parentUser: (Roles.userIsInRole(Meteor.user(), "admin"))?"":Meteor.userId(),
                }
            });
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
            email: String,
            password: String,
            password2: String,
            id: String,
            status: Match.Any,
        });
        Meteor.users.update(userAttributes.id, {
            $set: {
                "username": userAttributes.username,
                "profile.name": userAttributes.name,
                "email": userAttributes.email,
                "profile.status": userAttributes.status,
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
            value.speciality = value[1];
            value.year = value[2];
            delete value[0];
            delete value[1];
            delete value[2];
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
    },
    addProf: ( data ) => {
        check( Meteor.userId(), String );
        check( data, {
            name: String
        });
        let exists = Professions.findOne({name: data.name});
        if(!exists) {
            Professions.insert(data);
        } else {
            if(Meteor.isClient) {
                console.warn(`Отклонено. Профессия: "${data.name}" уже добавлена`);
                Bert.alert(`Отклонено. Профессия: "${data.name}" уже добавлена`, 'danger', 'fixed-top', 'fa-warning');
            }
        }
        return true;
    },
    deleteProf: ( id ) => {
        check(id, String);
        let exists = Professions.findOne({_id: id});
        if(exists) {
            Professions.remove({_id: id});
            if(Meteor.isClient) {
                Bert.alert(`Профессия: "${exists.name}" успешно удалена.`, 'success');
            }
        } else {
            if(Meteor.isClient) {
                Bert.alert(`Отклонено. Такой профессии не существует.`, 'warning', 'growl-top-right', 'fa-warning');
            }
        }
        return true;
    },
    addProfToStudent: (data) => {
        check( Meteor.userId(), String );
        check( data, {
            studentId: String,
            profId: String,
            gild: String,
            sector: String,
            controllerId: String,
            masterId: String,
            instructorId: String,
            createAt: String
        });

        let lastProfession = Profession2Student.findOne({studentId: data.studentId}, {sort: {createAt: -1}});
        if(lastProfession){
            let monthCounts = Journal.find({p2s: lastProfession._id}).count();
            if (monthCounts < 12) {
                throw new Meteor.Error('attach-warning', 'Отклонено. У студента не закрыта предыдущая практика.')
            } else {
                let p2s = Profession2Student.insert(data),
                    profession = Professions.findOne({_id: data.profId});
                if(Meteor.isClient) {
                    Bert.alert(`Профессия: "${profession.name}" успешно назначена студенту.`, 'success');
                }
            }
        } else {
            let p2s = Profession2Student.insert(data),
                profession = Professions.findOne({_id: data.profId});
            if(Meteor.isClient) {
                Bert.alert(`Профессия: "${profession.name}" успешно назначена студенту.`, 'success');
            }
        }
        return true;
    }
});