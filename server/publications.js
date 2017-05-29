import {Students} from '../lib/collections/students.js'

Meteor.publish('posts', function() {
  return Posts.find();
});

Meteor.publish('userList', function () {
  return Meteor.users.find({});
});

Meteor.publish('studentsList', function () {
    return Students.find();
});

Meteor.publish(null, function (){
  return Meteor.roles.find({})
});