const db = require('../../Config/connection');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const objectId  = require('mongodb').ObjectId ;

const { response } = require('../../app')

module.exports={

     
ViewAssignment: ()=>{

    return new Promise(async(resolve, reject) => {
        var Assignment =await db.get().collection(process.env.ASSIGNMENT).find().toArray();
        console.log(Assignment);
        resolve(Assignment)
    })
},
getAssignmentDetails: (AssignmentId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(process.env.ASSIGNMENT)
        .findOne({ _id: new objectId(AssignmentId) })
        .then((response) => {
          resolve(response);
          console.log(response+"assign details");
        });
    });
  },
    markAssignments: (assign,id ) => {
        return new Promise((resolve, reject) => {
          db.get()
            .collection(process.env.ASSIGNMENT)
            .updateOne(
              { _id: new objectId(id) },
              {
                $set: {
                 
                    // NameofStudent:id,
                    NameofAssignment:assign.assigNAME,
                    Assignment:assign.Assignment
                 
                },
                
              },
             
             
            )
            .then((response) => {
              resolve(response);
               
            });
        });
      },

      
}