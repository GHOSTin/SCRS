Template.profItem.events({
    'click .delete': (e) => {
        e.preventDefault();
        let id = $(e.target).closest('.btn').attr('data-prof-id');
        if(!_.isUndefined(id)) {
            Meteor.call('deleteProf', id, function (error, result) {
                if (error) {
                    console.log(error);
                }
            });
        }
    }
});