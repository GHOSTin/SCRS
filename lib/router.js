import {Students} from '/lib/collections/students'
import {Professions} from '/lib/collections/professions'
import {Profession2Student} from '/lib/collections/Profession2Student'

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'error'
});

Router.route('/', {
    name: 'resList',
    waitOn:() => {
        this.master = new ReactiveVar( false );
        if(Roles.userIsInRole(Meteor.user(), 'master')) {
            this.master.set(Meteor.userId());
        }
      return [
          Meteor.subscribe('studentsWithProfession', this.master.get()),
          Meteor.subscribe('p2s'),
          Meteor.subscribe('profList'),
          Meteor.subscribe('userList'),
          Meteor.subscribe('journal'),
      ];
    }
});

Router.route('/journal', {
  name: 'journal',
  waitOn: function() {
    return [Meteor.subscribe('p2s')];
  },
  data: function() {
    return Profession2Student.findOne({_id: this.params._id});
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
Router.onBeforeAction(requireLogin, {only: ['usersList', 'profList', 'journal']});