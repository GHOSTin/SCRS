import {Students} from '/lib/collections/students.js'
import {Professions} from '/lib/collections/professions'
import {Profession2Student} from '/lib/collections/Profession2Student'
import {Journal} from '/lib/collections/journal'

Meteor.publish('userList', function () {
  return Meteor.users.find({});
});

Meteor.publish('controllers', function () {
    let controllers = Roles.getUsersInRole('controller')
        .fetch()
        .map(function (e) {
            return e._id;
        });
    return Meteor.users.find({
        $and:[{
            _id: {$in: controllers}
        },{
            "profile.status": "active"
        }]
    })
});

Meteor.publish('masters', function (controllerId) {
    check(controllerId, Match.OneOf(String, null, undefined));
    let masters = Roles.getUsersInRole('master')
        .fetch()
        .map(function (e) {
            return e._id;
        });
    let query = {
            $and: [{
                _id: {$in: masters}
            }, {
                "profile.status": "active"
            }]
        };

    if (controllerId) {
        query = {
            $and:[{
                _id: {$in: masters}
            },{
                "profile.parentUser": controllerId
            },{
                "profile.status": "active"
            }]
        };
    }
    return Meteor.users.find(query);
});

Meteor.publish('instructors', function (masterId) {
    check(masterId, Match.OneOf(String, Boolean, null, undefined));
    let instructors = Roles.getUsersInRole('instructor')
        .fetch()
        .map(function (e) {
            return e._id;
        });
    let query = {
            $and: [{
                _id: {$in: instructors}
            }, {
                "profile.status": "active"
            }]
        };

    if (masterId) {
        query = {
            $and:[{
                _id: {$in: instructors}
            },{
                "profile.parentUser": masterId
            },{
                "profile.status": "active"
            }]
        };
    }
    return Meteor.users.find(query);
});

Meteor.publish('students', function (search) {
    check( search, Match.OneOf(String, null, undefined));

    let query = {},
        projection = {sort:{name: 1}};

    if(search) {
        let regex = new RegExp( search, 'i' );

        query = {
            $or: [
                {name: regex},
                {speciality: regex}
            ]
        }
    }
    return Students.find(query, projection);
});

Meteor.publish('studentsOfMaster', function(masterId){
    check(masterId, Match.OneOf(String, Boolean, null, undefined));

    let query = {};

    if(masterId) {
        let students = Profession2Student.find({masterId: masterId, isClosed: false})
            .fetch()
            .map(function (e) {
                return e.studentId;
            });
        query = {_id: {$in: students}};
    }
    return Students.find(query)
});

Meteor.publish('studentsWithProfession', function(masterId){
    check(masterId, Match.OneOf(String, Boolean, null, undefined));

    let query, p2sQuery = {}, self = this;

    if(masterId) {
        p2sQuery['masterId'] = masterId;
    }
    let students = Profession2Student.find(p2sQuery)
        .fetch()
        .map(function (e) {
            return e.studentId;
        });
    query = {_id: {$in: students}};
    return [
        Students.find(query),
        Profession2Student.find(p2sQuery),
        Journal.find({studentId: {$in: students}})
    ]
});


Meteor.publish('journal', function(){
    return Journal.find({})
});

Meteor.publish('profList', function () {
    return Professions.find();
});

Meteor.publish(null, function (){
  return Meteor.roles.find({})
});
Meteor.publish('p2s', function (){
  return Profession2Student.find({isClosed: false})
});