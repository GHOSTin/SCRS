import {Students} from '/lib/collections/students'

Template.resList.onCreated(function(){

});

Template.resList.onRendered(function(){
  $('.dataTables').DataTable();
});

Template.resList.helpers({
  students: function() {
    return Students.find({});
  }
});