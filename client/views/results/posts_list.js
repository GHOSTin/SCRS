import {Students} from '/lib/collections/students'

Template.resList.onCreated(function(){
});

Template.resList.onRendered(function(){
  if( this.subscriptionsReady() ) {
      let table = $('.dataTables').DataTable({
          rowsGroup: [0, 1, 2],
      });
  }
});

Template.resList.helpers({
  students: function() {
    return Students.find({});
  }
});