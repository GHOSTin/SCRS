import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Meteor.startup(()=> {
    $.material.init();
});

Meteor.subscribe('posts');
