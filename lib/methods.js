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
            parent: Match.Any
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
                    parentUser: (Roles.userIsInRole(Meteor.user(), "admin"))?userAttributes.parent:Meteor.userId(),
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
            parent: Match.Any
        });
        Meteor.users.update(userAttributes.id, {
            $set: {
                "username": userAttributes.username,
                "profile.name": userAttributes.name,
                "email": userAttributes.email,
                "profile.status": userAttributes.status,
                "profile.parentUser": (Roles.userIsInRole(Meteor.user(), "admin"))?userAttributes.parent:Meteor.userId()
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
    deleteUser: ( id ) => {
        if(Meteor.isServer) {
            let user = Meteor.users.findOne({_id: id});
            Roles.removeUsersFromRoles(user, user.roles);
            Meteor.users.remove(id);
        }
        return true;
    },
    parseUpload( data ){
        check(data, Array);
        data = _.map(data, function(value, key){
            return _.object(['name', 'speciality', 'year'], value);
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
    deleteStudent: ( id )=>{
        if(Meteor.isServer) {
            Profession2Student.remove({studentId: id});
            Journal.remove({studentId: id});
            Students.remove({_id: id});
        }
        return true;
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
            Profession2Student.remove({profId: id});
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
            createAt: String,
            isClosed: Boolean
        });

        let lastProfession = Profession2Student.findOne({studentId: data.studentId, isClosed: false}, {sort: {createAt: -1}});
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
    },
    closeProfToStudent(data){
        check( data, {
            studentId: String,
            rank: String,
        });
        Profession2Student.update(
            {studentId: data.studentId, isClosed: false},
            {$set:
                {
                    "isClosed": true,
                    "rank": data.rank
                }
            }
        )
    },
    addResultsToJournal(data) {
        check( Meteor.userId(), String );
        check( data, {
            startDate: Date,
            endDate: Date,
            points: Object
        });
        _.each(data.points, (elem, index, list)=>{
            let lastProfession = Profession2Student.findOne({studentId: index, isClosed: false}, {sort: {createAt: -1}});
            Journal.insert({
                studentId: index,
                profId: lastProfession.profId,
                points: elem,
                startDate: data.startDate,
                endDate: data.endDate,
            })
        });
        return true;
    }
});