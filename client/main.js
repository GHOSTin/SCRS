import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

$.material.init();

Meteor.subscribe('posts');
