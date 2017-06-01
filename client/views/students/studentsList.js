Template.studentsList.events({
    'click #import': function(e){
        e.preventDefault();
        Modal.show('studentsImportModal');
    },
});