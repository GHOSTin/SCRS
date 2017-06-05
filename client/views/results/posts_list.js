import {Students} from '/lib/collections/students'

Template.resList.helpers({
  students: function() {
    return Students.find({});
  }
});