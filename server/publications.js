import {Students} from '../lib/collections/students.js'
import {Professions} from '../lib/collections/professions'

Meteor.publish('posts', function() {
  return Posts.find();
});

Meteor.publish('userList', function () {
  return Meteor.users.find({});
});

Meteor.publish('studentsList', function () {
    return Students.find();
});

Meteor.publish('profList', function () {
    return Professions.find();
});

Meteor.publish(null, function (){
  return Meteor.roles.find({})
});