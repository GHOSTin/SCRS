import {Students} from '/lib/collections/students'

Template.resList.onCreated(function(){
});

Template.resList.onRendered(function(){
  if( this.subscriptionsReady() ) {
      let table = $('.dataTables').DataTable({
          responsive: true,
          autoWidth: false,
          "columnDefs": [
              { "width": "250px", "targets": [2,3,4] }
          ],
          fixedColumns: {
              leftColumns: 3
          },
          rowsGroup: [0, 1, 2],
      });
  }
});

Template.resList.helpers({
  students: function() {
    return Students.find({});
  }
});