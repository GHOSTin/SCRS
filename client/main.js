import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Meteor.startup(()=> {
    $.material.init();
    $('select').select2({

    })
});

Meteor.subscribe('posts');
