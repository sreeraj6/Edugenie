const db = require('../../Config/connection');
const bcrypt = require('bcrypt');
// const { ObjectId } = require('mongodb')
const { response } = require('../../app')
const { ObjectId } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const  id= new ObjectId();;

module.exports={ 


    uploadAssignment:(uploadData,assgId)=>{
        var assignment = {
         NameofStudent:assgId,
         NameofAssignment:uploadData.assigNAME,
         Assignment:uploadData.assignment
        }
        return new Promise( (resolve, reject) => {
         let response = {}
         // let find = null;
         // find = await db.get().collection(process.env.STUDENTDB).findOne({Name: student.Name})
 
         // if(find){
         //     response.user = true
         //     resolve(response);
         
          db.get().collection(process.env.ASSIGNMENT).insertOne(assignment).then((response) => {
                 response.user = false;
                 console.log(response);
                 resolve(response);
             })
         
     })
 },


}