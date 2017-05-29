Template.usersList.events({
    'click #add': function(e){
        e.preventDefault();
        ModalHelper.openModalFor(null);
    },
    'click .edit': function (e) {
        e.preventDefault();
        var user = $(e.target).closest('.edit'),
            userId = user.attr('data-user-id');
        ModalHelper.openModalFor(userId);
    }
});