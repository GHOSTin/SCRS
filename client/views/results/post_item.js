import {Professions} from '/lib/collections/professions'
import {Profession2Student as P2S} from '/lib/collections/Profession2Student'
import {Journal} from '/lib/collections/journal'

Template.resItem.helpers({
    firstRow(row, data){
        return data.indexOf(row) === 0;
    },
    profession(id) {
      return Professions.findOne({
            _id: id
        })||[];
    },
    p2s() {
      return P2S.find({
          studentId: Template.currentData()._id
      }).fetch()||[];
    },
    userData(id) {
      return Meteor.users.findOne({_id:id})
    },
    results(sid, pid){
      let request = Journal.find({studentId: sid, profId: pid}).fetch();
      let response = [0,0,0,0,0];
      _.each(request, ( elem )=>{
        _.each(elem.points, (elem, index)=>{
          response[index] += parseInt(elem);
        })
      });
      return response.map((elem)=>{
        return (request.length)?(elem/request.length).toFixed(2):'';
      });
    },
    plans(sid, pid){
      let arr = [];
      let request = Journal.find({studentId: sid, profId: pid})
          .fetch()
          .map((e)=>{
            return e.points;
          });
      arr = _.range(0,12,0);
      return $.extend(arr, request);
    },
    actuality(sid, pid){
        let lastRecord = Journal
            .find({studentId: sid, profId: pid},{sort: {endDate: 1}, limit:1})
            .fetch()
            .pop()
            ,last = lastRecord?new Date(lastRecord.endDate):new Date()
            ,now = new Date();
        return Math.ceil(Math.abs(now.getTime() - last.getTime())/(1000*3600*24)) <= 14 ||
            Journal.find({studentId: sid, profId: pid}).count() <= 12;
    }
});