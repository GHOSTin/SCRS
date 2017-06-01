import {RolesCollection} from '../../../lib/collections/roles'
Template.userItem.helpers({
  roles: function(){
    return Roles.getRolesForUser(this._id).join(', ')
  }
});