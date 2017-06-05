import {Professions} from '/lib/collections/professions'

Template.studentsAddProfessionModal.onCreated(()=>{
    let template = Template.instance();
    template.autorun( () => {
        template.subscribe('profList');
        template.subscribe('controllers');
    });
});

Template.studentsAddProfessionModal.onRendered(()=>{
    $('select').select2({
        dropdownParent: $('#studentsAddProfessionModal'),
        theme: "bootstrap"
    })
});

Template.studentsAddProfessionModal.helpers({
    professions() {
        return Professions.find({})
    },
    controllers() {
        let controllers = Roles.getUsersInRole('controller');
        if (controllers) {
            return controllers;
        }
    }
});