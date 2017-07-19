import {Professions} from '/lib/collections/professions'
import {Profession2Student} from '/lib/collections/Profession2Student'

Template.studentItem.onCreated(()=>{
    Template.instance().subscribe('p2s');
    Template.instance().subscribe('profList');
    Template.instance().subscribe('masters')
});

Template.studentItem.helpers({
    profession() {
        let p2u = Profession2Student.findOne({
            studentId: Template.currentData()._id
        });
        return (p2u)?
            Professions.findOne({
                _id: p2u.profId
            }):[];
    },
    master() {
        let p2u = Profession2Student.findOne({
            studentId: Template.currentData()._id
        });
        return (p2u)?Meteor.users.findOne({_id: p2u.masterId}):[];
    }
});

Template.studentItem.events({
    'click .merge': function(e) {
        Session.set('selectedStudent', e.target.getAttribute('data-user-id').trim());
        Modal.show('studentsAddProfessionModal');
    }
});