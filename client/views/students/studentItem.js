import {Professions} from '/lib/collections/professions'
import {Profession2Student} from '/lib/collections/Profession2Student'

Template.studentItem.onCreated(()=>{
    Template.instance().subscribe('p2s');
    Template.instance().subscribe('profList');
});

Template.studentItem.helpers({
    profession() {
        return Professions.findOne({
            _id: Profession2Student.findOne({
                studentId: Template.currentData()._id
            }).profId
        });
    }
});

Template.studentItem.events({
    'click .merge': function(e) {
        Session.set('selectedStudent', e.target.getAttribute('data-user-id').trim());
        Modal.show('studentsAddProfessionModal');
    }
});