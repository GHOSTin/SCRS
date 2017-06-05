import {Students} from '../lib/collections/students.js'
import {Professions} from '../lib/collections/professions'
import {Results} from '../lib/collections/results'

Meteor.publish('results', function() {
  return Results.find({});
});

Meteor.publish('userList', function () {
  return Meteor.users.find({});
});

Meteor.publish('controllers', function () {
    let controllers = Roles.getUsersInRole('controller');
    if (controllers) {
        return controllers
    }
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

Meteor.publish('profList', function () {
    return Professions.find();
});

Meteor.publish(null, function (){
  return Meteor.roles.find({})
});