import {Students} from '/lib/collections/students'
import {Professions} from '/lib/collections/professions'
import {Results} from '/lib/collections/results'

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'error'
});

Router.route('/', {
  name: 'resList',
  waitOn: function() {
      return [Meteor.subscribe('studentsList'), Meteor.subscribe('results')];
  }
});

Router.route('/posts/:_id', {
  name: 'postItem',
  waitOn: function() {
    return Meteor.subscribe('posts');
  },
  data: function() {
    return Results.findOne({_id: this.params._id});
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
    name: 'studentsList'
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

//noinspection JSUnresolvedFunction
Router.onBeforeAction('loading');
//noinspection JSUnresolvedFunction
Router.onBeforeAction(requireLogin, {only: ['usersList', 'profList']});