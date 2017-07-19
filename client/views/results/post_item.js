import {Professions} from '/lib/collections/professions'
import {Profession2Student as P2S} from '/lib/collections/Profession2Student'
import {Journal} from '/lib/collections/journal'

Template.resItem.helpers({
  profession() {
    let p2u = P2S.findOne({
      studentId: Template.currentData()._id
    });
    return (p2u)?
      Professions.findOne({
          _id: p2u.profId
      }):[];
  },
  p2s() {
    return P2S.findOne({
        studentId: Template.currentData()._id
    })||[];
  },
    userData(id) {
      return Meteor.users.findOne({_id:id})
    },
    results(id){
      let request = Journal.find({studentId: id}).fetch();
      console.log(request);
      let response = [0,0,0,0,0];
      _.each(request, ( elem )=>{
        _.each(elem.points, (elem, index)=>{
          response[index] += parseInt(elem);
        })
      });
      return response.map((elem)=>{
        return (request.length)?(elem/request.length).toFixed(2):'';
      });
    }
});