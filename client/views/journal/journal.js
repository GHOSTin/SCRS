require('jquery-serializejson');
import {Students} from '/lib/collections/students'
import moment from '/client/plugins/moment/moment-with-locales'

Template.journal.onCreated(()=>{
    let masterId = new ReactiveVar( false );
    if(Roles.userIsInRole(Meteor.user(), 'master')){
        masterId.set(Meteor.userId());
    }
    Template.instance().autorun( () => {
        console.log(masterId.get());
        Template.instance().subscribe('studentsOfMaster', masterId.get());
    });
});

Template.journal.onRendered(()=>{
    let $weekPicker = $('#weekly-datepicker');
    $weekPicker.datepicker({
        language: "ru",
        maxViewMode: 0,
        weekStart: 1
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
    }
});

Template.journal.events({
    'click #addWeekPlan': (event, template) => {
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
        })
    }
});