import {RolesCollection} from '/lib/collections/roles'
Template.userItem.helpers({
  roles: function(){
    return Roles.getRolesForUser(this._id).join(', ')
  }
});

Template.userItem.events({
    'click .delete': (event)=>{
        event.preventDefault();
        let userId = $(event.currentTarget).attr('data-user-id');
        if(confirm('Вы действительно хотите удалить пользователя?')){
            Meteor.call('deleteUser', userId, (error, result)=>{
                if (error) {
                    console.log(error);
                    return false;
                }
                Bert.alert( 'Удалено!', 'success', 'growl-top-right' );
            })
        }
    }
});