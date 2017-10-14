require('jquery-serializejson');
import {Professions} from '/lib/collections/professions'
import {Profession2Student} from '/lib/collections/Profession2Student'
import {Students} from '/lib/collections/students'

Template.studentEditModal.onCreated(()=>{
    let template = Template.instance();
    template.controllerId = new ReactiveVar();
    template.masterId = new ReactiveVar();
    template.autorun( () => {
        template.subscribe('profList');
        template.subscribe('controllers');
        template.subscribe('masters');
        template.subscribe('instructors');
    });
});

Template.studentEditModal.onRendered(()=>{
    $('select').select2({
        dropdownParent: $('.modal'),
        theme: "bootstrap"
    })
});

Template.studentEditModal.helpers({
    student(){
        return Students.findOne({_id: Session.get('selectedStudent')})
    },
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
    },
    hasProfession(){
        return  Profession2Student.findOne({studentId: Session.get('selectedStudent'), isClosed: false}, {sort: {createAt: -1}})
    }
});

Template.studentEditModal.events({
    "change #controller": function(element, template){
        let value = element.target.value.trim();

        if (value !== "") {
            template.controllerId.set(value);
            template.masterId.set(false);
        }
    },
    "change #master": function(element, template){
        let value = element.target.value.trim();

        if (value !== "") {
            template.masterId.set(value);
        }
    },
    'click #save': function(e) {
        e.preventDefault();
        let student = Session.get('selectedStudent'),
            result = $('#form').serializeJSON();
        Meteor.call('editStudent', student, result, function(error, result){
            if (error) {
                console.log(error);
                Bert.alert(error.reason, 'danger', 'fixed-top', 'fa-warning');
            }
        });
        console.log(result);
        Session.set('selectedStudent', null);
        Modal.hide("studentEditModal");
    }
});