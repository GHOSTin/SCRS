ModalHelper = {};

ModalHelper.openModalFor = function(userId) {
    if(Meteor.isClient) {
        Session.set('selectedUser', userId);
        Modal.show('userModal');
    }
};