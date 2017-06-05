import {Students} from '/lib/collections/students'

Template.studentsList.onCreated( () => {
    let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.searching = new ReactiveVar( false );

    template.autorun( () => {
        template.subscribe('students', template.searchQuery.get(), ()=>{
            setTimeout(()=>{
                template.searching.set( false );
            }, 3000)
        });
    });
});

Template.studentsList.helpers({
    query() {
        return Template.instance().searchQuery.get();
    },
    students() {
        let students = Students.find();
        if (students) {
            return students;
        }
    }
});

Template.studentsList.events({
    'click #import': function(e){
        e.preventDefault();
        Modal.show('studentsImportModal');
    },
    'keyup #studentName': function(e, template) {
        let value = $('#studentName').val().trim();

        if(value !== '' && e.keyCode === 13 ){
            template.searchQuery.set(value);
            template.searching.set( true );
        }

        if( value === "" ) {
            template.searchQuery.set(value);
        }
    },
    'click #find': function(e, template){
        e.preventDefault();
        let value = $('#studentName').val().trim();

        if(value !== ''){
            template.searchQuery.set(value);
            template.searching.set( true );
        }

        if( value === "" ) {
            template.searchQuery.set(value);
        }
    }
});