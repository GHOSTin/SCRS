import {Students} from './collections/students.js'

Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'postsList'
});

Router.route('/posts/:_id', {
  name: 'postItem',
  data: function() {
    return Posts.findOne({_id: this.params._id});
  }
});

Router.route('/users', {
  name: 'usersList',
  loadingTemplate: 'loading',
  waitOn: function() {
    return Meteor.subscribe('userList');
  },
  data: function() {
    return Meteor.users.find({});
  }
});

Router.route('/students', {
    name: 'studentsList',
    loadingTemplate: 'loading',
    waitOn: function() {
        return Meteor.subscribe('studentsList');
    },
    data: function() {
        return Students.find();
    }
});

let requireLogin = function(){
  if(!Meteor.user()) {
      this.render('accessDenied');
  } else {
    this.next();
  }
};

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only: 'usersList'});