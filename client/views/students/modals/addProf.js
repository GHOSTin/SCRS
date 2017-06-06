import {Professions} from '/lib/collections/professions'

Template.studentsAddProfessionModal.onCreated(()=>{
    let template = Template.instance();
    template.controllerId = new ReactiveVar();
    template.masterId = new ReactiveVar();
    template.autorun( () => {
        template.subscribe('profList');
        template.subscribe('controllers');
        template.subscribe('masters', template.controllerId.get());
        template.subscribe('instructors', template.masterId.get(), template.controllerId.get());
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
    },
    masters() {
        let masters =  Roles.getUsersInRole('master');
        if (masters) {
            return masters;
        }
    },
    instructors() {
        let instructors =  Roles.getUsersInRole('instructor');
        if (instructors) {
            return instructors;
        }
    }
});

Template.studentsAddProfessionModal.events({
    "change #controller": function(element, template){
        let value = element.target.value.trim();

        if (value !== "") {
            template.controllerId.set(value);
            template.masterId.set("");
        }
    },
    "change #master": function(element, template){
        let value = element.target.value.trim();

        if (value !== "") {
            template.masterId.set(value);
        }
    },
    'click #add': function(e) {
        e.preventDefault();
        let student = Session.get('selectedStudent'),
            result = {
                studentId: student,
                profId: $('#profName').val(),
                gild: $('#gild').val(),
                sector: $('#sector').val(),
                controllerId: $('#controller').val(),
                masterId: $('#master').val(),
                instructorId: $('#instructor').val(),
                createAt: new Date().toISOString()
            };
        Meteor.call('addProfToStudent', result, function(error, result){
            if (error) {
                console.log(error);
                Bert.alert(error.reason, 'danger', 'fixed-top', 'fa-warning');
            }
        });
        Modal.hide("studentsAddProfessionModal");
    }
});