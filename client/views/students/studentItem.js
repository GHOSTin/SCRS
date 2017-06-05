Template.studentItem.events({
    'click .merge': function(e) {
        Session.set('selectedStudent', e.target.getAttribute('data-user-id').trim());
        Modal.show('studentsAddProfessionModal');
    }
});