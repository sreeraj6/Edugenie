const db = require('../../Config/connection');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb')
const { response } = require('../../app')

module.exports = {
    //add new department
    addDept: (deptData) => {
        
        var dept = {
            Name:deptData.name,
            Capacity: deptData.capacity,
            Semesters : deptData.semester
        }

        return new Promise(async (resolve, reject) => {
            let response = {}
            let find = null
            find = await db.get().collection(process.env.DEPTDB).findOne({Name: deptData.name})
            if(find){
                response.status = false;
                resolve(response);
            }
            try {
                db.get().collection(process.env.DEPTDB).insertOne(dept).then(
                    (response) => {
                        response.status = true
                        resolve(response);
                    }
                )
            } catch (error) {
                console.log(error);
                response.status = false
                resolve(response);
            }
            
        })
    },

    //delete department
    delDept: (deptData) => {

        return new Promise( (resolve, reject) => {
            db.get().collection(process.env.DEPTDB).deleteOne(deptData.name , Name).
            then((response)=>{
                resolve(response);
            })
        })
    },

    //add syllabus
    addSyllabus: (deptSyllab) => {

    }
}