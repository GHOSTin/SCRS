Template.profList.events({
    'click #add': (e) => {
        e.preventDefault();
        let prof = {
            name: $.trim($('#profName').val())
        };
        if(Meteor.user()){
            Meteor.call('addProf', prof, function (error, result) {
                if (error) {
                    console.log(error);
                }
                $('#profName').val("")
            });
        }
    }
});