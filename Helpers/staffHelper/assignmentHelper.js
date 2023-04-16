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
      var doubt = await db.get().collection(process.env.DOUBTDB).find({deptId:deptId}).toArray();
      resolve(doubt)
    })
  },

  solvedDoubt: (staffId) => {

    return new Promise(async (resolve, reject) => {
      var solved = await db.get().collection(process.env.DOUBTDB).find({staffId: staffId}).toArray();
      resolve(solved)
    })
  }


}