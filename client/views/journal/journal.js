require('jquery-serializejson');
import {Students} from '/lib/collections/students'
import {Profession2Student} from '/lib/collections/Profession2Student'
import {Professions} from '/lib/collections/professions'
import moment from '/client/plugins/moment/moment-with-locales'

Template.journal.onCreated(()=>{
    Template.instance().autorun( () => {
        Template.instance().subscribe('studentsOfMaster');
    });
});

Template.journal.onRendered(()=>{
    let $weekPicker = $('#weekly-datepicker');
    $weekPicker.datepicker({
        language: "ru",
        maxViewMode: 0,
        weekStart: 1,
        todayHighlight: true
    }).on('changeDate', function (e) {
        if ($weekPicker.data('updating') === true) {
            return;
        }
        $weekPicker.data('updating', true);

        let monday = moment(e.date).startOf('isoWeek');

        let weekDates = [
            monday.clone().toDate(),
            monday.clone().add(1, "days").toDate(),
            monday.clone().add(2, "days").toDate(),
            monday.clone().add(3, "days").toDate(),
            monday.clone().add(4, "days").toDate(),
            monday.clone().add(5, "days").toDate(),
            monday.clone().add(6, "days").toDate()
        ];

        $(this).datepicker('clearDate').datepicker('setDates', weekDates);

        $weekPicker.data('updating', false);
    });
});

Template.journal.helpers({
    students() {
        let students = Students.find();
        if (students) {
            return students;
        }
    },
    profession(id) {
        let p2u = Profession2Student.findOne({
            studentId: id,
            isClosed: false
        });
        return (p2u)?
            Professions.findOne({
                _id: p2u.profId
            }):[];
    }
});

Template.journal.events({
    'submit #form': (event, template) => {
        event.preventDefault();
        let results = $('#form').serializeJSON();
        let dates = $('#weekly-datepicker').datepicker('getDates');
        if(_.isEmpty(dates)){
            Bert.alert('Выберите период!', 'fixed-top', 'danger', 'fa-calendar');
            return false;
        }
        _.extend(results, {startDate: new Date(_.first(dates)), endDate: new Date(_.last(dates))});
        Meteor.call('addResultsToJournal', results, function(error, response){
            if(error) {
                Bert.alert(error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                return false;
            }
            $('#weekly-datepicker').datepicker('update','');
            document.getElementById('form').reset();
        });
        return false;
    },
    'click #endProfession': ( event, template ) => {
        event.preventDefault();
        Modal.show('closeProfession');
        Session.set('closeProfessionStudent', $(event.currentTarget).data('student'))
    }
});