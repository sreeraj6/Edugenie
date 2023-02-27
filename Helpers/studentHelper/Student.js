const db = require('../../Config/connection');
const bcrypt = require('bcrypt');
// const { ObjectId } = require('mongodb')
const { response } = require('../../app')
const { ObjectId } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const  id= new ObjectId();;

module.exports={ 


    uploadAssignment:(uploadData,assgId)=>{

        return new Promise( async(resolve, reject) => {
         let response = {}
         // let find = null;
         // find = await db.get().collection(process.env.STUDENTDB).findOne({Name: student.Name})
 
         // if(find){
         //     response.user = true
         //     resolve(response);
         
        let studentName= await db.get().collection(process.env.STUDENTDB).findOne({})
        console.log("student name is", studentName);
     
         var assignment = {
            NameofStudent:studentName.Name,
            NameofAssignment:uploadData.assigNAME,
            Assignment:uploadData.assignFile
           }
         
           db.get().collection(process.env.ASSIGNMENT).insertOne(assignment).then((response) => {
            response.user = false;
            console.log(response);
            resolve(response);
        })
         
     })
 },
 assignmentStatus: (id)=>{

    return new Promise(async(resolve, reject) => {
        // var Assignment =await db.get().collection(process.env.ASSIGNMENT).findOne({_id: new ObjectId(id) }).then((CheckedStatus)=>{
        //     // if(status.checkedState==undefined){
        //     //     resolve("not marked")
        //     // }else{
        //     //     resolve(checkedState)
        //     //     checkedState("checkedState", checkedState)
        //     // }
        //     resolve(CheckedStatus)
        // })
        var Assignment =await db.get().collection(process.env.ASSIGNMENT).find().toArray();
        console.log(Assignment);
        resolve(Assignment)
        console.log(Assignment);
        
    })
},

}