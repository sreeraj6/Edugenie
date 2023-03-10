const db = require('../../Config/connection');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const { response } = require('../../app')



module.exports = {
    addStudent: (studentData) => {
        var dept = studentData.StuDept.split(",");
        var student = {
            Name:studentData.StuName,
            candidateCode:studentData.StuCode,
            Department:dept[1],
            Dept_Id:dept[0],
            Semester:studentData.sem
            
        }

        return new Promise(async (resolve, reject) => {
            let response = {}
            let find = null;
            find = await db.get().collection(process.env.STUDENTDB).findOne({$and:[{candidateCode: student.candidateCode},{Department:student.Department}]});

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

    getStudent: () => {
        
        return new Promise(async(resolve, reject) => {
            var student = await db.get().collection(process.env.STUDENTDB).find().toArray()
            resolve(student);
        })
    },

    
}