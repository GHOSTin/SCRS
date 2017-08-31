Template.studentsImportModal.onCreated( () => {
    this.uploading = new ReactiveVar( false );
});

Template.studentsImportModal.helpers({
    uploading() {
        return false//Template.instance().uploading.get()
    }
});

Template.studentsImportModal.events({
    'click #import': function(event, template) {
        //template.uploadings.set( true );
        let fileinput = $(event.target).closest('.modal').find('#inputCSV');
        Papa.parse(fileinput[0].files[0], {
            header: false,
            skipEmptyLines: true,
            encoding: 'windows-1251',
            complete(results, file){
                Meteor.call('parseUpload', results.data, (error, response) => {
                    if(error) {
                        Bert.alert(error.reason, "warning");
                    } else {
                        //template.uploadings.set( false );
                        Bert.alert( 'Загрузка завершена!', 'success', 'growl-top-right' );
                    }
                    Modal.hide("studentsImportModal");
                });
            }
        })
    }
});