const db = require('../../Config/connection');
const bcrypt = require('bcrypt');
const { ObjectId, Timestamp } = require('mongodb');
const objectId = require('mongodb').ObjectId;

const { response } = require('../../app')

module.exports = {

  giveAssignment: async (assignmentData) => {
    var sub = await db.get().collection(process.env.SUBJECTDB).findOne({_id: new ObjectId(assignmentData.subject_id)});

    var data = {
      topic:assignmentData.topic,
      subject_id: assignmentData.subject_id,
      deptId: sub.Dept_Id,
      last_date: assignmentData.last_date,
      semester: sub.semester,
      sub_name: sub.sub_name,
      statuscode: 1,
      date:Timestamp
    }

    return new Promise((resolve, reject) => {
      db.get().collection(process.env.ASSIGNMENT).insertOne(data)
      .then((response) => {
        resolve(response);
      })
    })
  },
  
  getRaisedDoubts: (deptId) => {

    return new Promise(async(resolve,reject) => {
      var doubt = await db.get().collection(process.env.DOUBTDB).find({$and:[{deptId:deptId},{statuscode:1}]}).toArray();
      resolve(doubt)
    })
  },

  solvedDoubt: (staffId) => {

    return new Promise(async (resolve, reject) => {
      var solved = await db.get().collection(process.env.DOUBTDB).find({staffId: staffId}).toArray();
      resolve(solved)
    })
  },

  updateDoubtStatus: (doubtId,staff_id) => {

    return new Promise((resolve,reject) => {
      db.get().collection(process.env.DOUBTDB).updateOne({_id:new ObjectId(doubtId)}, 
        {
          $set: {
          statuscode:0,
          staffId: staff_id,
          alert: true
        }
        }).then((response) =>{
        resolve(response)
      })
    })
  },

  getRating: (staffId) => {

    return new Promise(async (resolve, reject) => {
      var doubts = await db.get().collection(process.env.DOUBTDB).find({staffId: staffId}).toArray();
      var rate;
      for(var i = 0; i < doubts.length; i++) {
        rate += doubts[i].rate;
      }

      var total = doubts * 4;
      var ans = {}
      if(rate < total*0.25) {
        ans.rating = 1;
        ans.badge = 'Novice'
      }
      else if(rate < total * 0.5) {
        ans.rating = 2;
        ans.badge = 'Expert Answerer'
      }
      else if(rate < total * 0.75) {
        ans.rating = 3;
        ans.badge = 'Experienced'
      }
      else {
        ans.rating = 4;
        ans.badge = 'Rising Star'
      }
      resolve(ans)
    })
  }

}