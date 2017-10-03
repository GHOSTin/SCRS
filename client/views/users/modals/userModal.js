import {RolesCollection} from '/lib/collections/roles'
import "/public/js/pmd-select2.js"

Template.userModal.onCreated(()=>{
    Template.instance().parentUsersList = new ReactiveVar();
    let user = Meteor.users.findOne(Session.get('selectedUser'));
    if(Roles.userIsInRole(user, 'master')) {
        let userList = Roles.getUsersInRole('controller');
        Template.instance().parentUsersList.set(userList);
    }
    if(Roles.userIsInRole(user, 'instructor')) {
        let userList = Roles.getUsersInRole('master');
        Template.instance().parentUsersList.set(userList);
    }
});

Template.userModal.onRendered(()=>{
    $.fn.modal.Constructor.prototype.enforceFocus = $.noop;
    $('#role, #parent').select2({
        dropdownParent: $('#userModal'),
        theme: "bootstrap"
    })
});

Template.userModal.helpers({
    user: function() {
        let userId = Session.get('selectedUser');

        if (typeof userId !== "undefined") {
            return Meteor.users.findOne(userId);
        } else {
            return {username:'', profile:{name: ''}, roles: []}
        }
    },
    roles: () => {return RolesCollection;},
    parentUsers() {
        let template = Template.instance();
        return template.parentUsersList.get()
    }
});

Template.userModal.events({
    'click #save': function(e){
        e.preventDefault();
        let userId = Session.get('selectedUser'),
            user = {
                name: $('#name').val(),
                username: $('#username').val(),
                email: $('#email').val(),
                password: $('#password').val()||"",
                password2: $('#password2').val()||"",
                role: $('#role').val(),
                status: $('#status').is(':checked')?"active":""
            };
        if (!userId) {
            Meteor.call('addUser', user, function (error, result) {
                if (error) {
                    console.log(error);
                }
            });
        } else {
            _.extend(user, {id: userId});
            Meteor.call('editUser', user, function(error, result){
                if (error) {
                    console.log(error);
                }
            });
        }

        Modal.hide('userModal');
    },
    'change select#role': (e, template) => {
        if($(e.target).val() === "master") {
            let userList = Roles.getUsersInRole('controller');
            template.parentUsersList.set(userList);
        }
        if($(e.target).val() === "instructor") {
            let userList = Roles.getUsersInRole('master');
            template.parentUsersList.set(userList);
        }
        if($(e.target).val() === "admin" || $(e.target).val() === "controller"){
            template.parentUsersList.set(false);
        }
        $('#parent').select2("val", "");
    },
});