Template.userModal.helpers({
    user: function() {
        var userId = Session.get('selectedUser');

        if (typeof userId !== "undefined") {
            return Meteor.users.findOne(userId);
        } else {
            return {username:'', profile:{name: ''}, roles: []}
        }
    }
});

Template.userModal.events({
    'click #save': function(e){
        e.preventDefault();
        var user = {
            name: $('#name').val(),
            username: $('#username').val(),
            password: $('#password').val(),
            role: $('#role').val()
        };
        
        Meteor.call('addUser', user, function(error, result){
            if (error) {
                console.log(error);
            }
        });

        Modal.hide('userModal');
    }
});