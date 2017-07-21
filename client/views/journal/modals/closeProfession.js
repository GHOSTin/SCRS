Template.closeProfession.events({
    'click #close': (event, template) => {
        event.preventDefault();
        let result = {
            studentId: Session.get('closeProfessionStudent'),
            rank: $('input[name="rank"]').val()
        };
        Meteor.call('closeProfToStudent', result, function(error, result){
            if (error) {
                Bert.alert(error.reason, 'danger', 'fixed-top', 'fa-warning');
                return false;
            }
            Modal.hide(this);
        });
    }
});