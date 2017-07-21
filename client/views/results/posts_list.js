import {Students} from '/lib/collections/students'

Template.resList.onCreated(function(){
});

Template.resList.onRendered(function(){
  if( this.subscriptionsReady() ) {
      let table = $('.dataTables').DataTable({
          /*buttons: [
              {extend: 'excel', title: 'ExampleFile'},
              {extend: 'pdf', title: 'ExampleFile'},

              {extend: 'print',
                  text: 'Печать',
                  customize: function (win){
                      $(win.document.body).addClass('white-bg');
                      $(win.document.body).css('font-size', '10px');

                      $(win.document.body).find('.table-responsive').removeClass('table-responsive');
                      $(win.document.body).find('table')
                          .addClass('compact')
                          .css('font-size', 'inherit');
                  }
              }
          ],*/
          rowsGroup: [0, 1, 2],
      });
  }
});

Template.resList.helpers({
  students: function() {
    return Students.find({});
  }
});