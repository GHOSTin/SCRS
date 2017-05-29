ModalHelper = {};

ModalHelper.openModalFor = function(userId) {
    if(Meteor.isClient) {
        Session.set('selectedUser', userId);
        $.material.init();
        Modal.show('userModal');
    }
};