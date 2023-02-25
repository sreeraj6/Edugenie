const db = require('../../Config/connection');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const id = new ObjectId();;
const { response } = require('../../app')



module.exports = {
    addStudent: (studentData) => {
        var student = {
            Name:studentData.StuName,
            candidateCode:studentData.StuCode,
            Department:studentData.StuDept,
            Semester:studentData.sem
            
        }

        return new Promise(async (resolve, reject) => {
            let response = {}
            let find = null;
            find = await db.get().collection(process.env.STUDENTDB).findOne({Name: student.Name})

            if(find){
                response.user = true
                resolve(response);
            }
            else {
                 student.Password = await bcrypt.hash(student.candidateCode, 10);
                db.get().collection(process.env.STUDENTDB).insertOne(student).then((response) => {
                    response.user = false;
                    console.log(response);
                    resolve(response);
                })
            }
        })
    },

    uploadAssignment:(uploadData)=>{
       var assignment = {
        NameofStudent:"",
        NameofAssignment:uploadData.assigNAME,
        Assignment:uploadData.assignment
       }
       return new Promise( async(resolve, reject) => {
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