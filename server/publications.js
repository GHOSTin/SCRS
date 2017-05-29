Meteor.publish('posts', function() {
  return Posts.find();
});

Meteor.publish('userList', function () {
  return Meteor.users.find({});
});

Meteor.publish(null, function (){
  return Meteor.roles.find({})
});