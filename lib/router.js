import {Students} from './collections/students'
import {Professions} from './collections/professions'

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'error'
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
    if(Roles.userIsInRole(Meteor.user(), "admin"))
        return Meteor.users.find({});
    if(Roles.userIsInRole(Meteor.user(), ["controller", "master"]))
          return Meteor.users.find({"profile.parentUser": Meteor.userId()});
  }
});

Router.route('/students', {
    name: 'studentsList',
    waitOn: function() {
        return Meteor.subscribe('studentsList');
    },
    data: function() {
        return Students.find();
    }
});

Router.route('/professions', {
    name: 'profList',
    waitOn: () => {
        return Meteor.subscribe('profList');
    },
    data: () => {
        return Professions.find();
    }
});

let requireLogin = function(){
  if(!Meteor.user()) {
      this.render('accessDenied');
  } else {
      if(!(Roles.userIsInRole(Meteor.user(), ['admin','master','controller']))) {
          this.render('accessDenied');
      } else {
          this.next();
      }
  }
};

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only: ['usersList', 'profList']});