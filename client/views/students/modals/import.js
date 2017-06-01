Template.studentsImportModal.onCreated( () => {
    Template.instance().uploading = new ReactiveVar( false );
});

Template.studentsImportModal.helpers({
    uploading() {
        return Template.instance().uploading.get()
    }
});

Template.studentsImportModal.events({
    'click #import' (event, template) {
        let fileinput = $(event.target).closest('.modal').find('#inputCSV');
        Papa.parse(fileinput[0].files[0], {
            header: false,
            skipEmptyLines: true,
            complete(results, file){
                Meteor.call('parseUpload', results.data, (error, response) => {
                    if(error) {
                        Bert.alert(error.reason, "warning");
                    } else {
                        template.uploading.set( false );
                        Bert.alert( 'Загрузка завершена!', 'success', 'growl-top-right' );
                    }
                    Modal.hide("studentsImportModal");
                });
            }
        })
    }
});