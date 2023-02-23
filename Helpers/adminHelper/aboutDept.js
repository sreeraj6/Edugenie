const db = require('../../Config/connection');
const bcrypt = require('bcrypt');
const { response } = require('../../app');
const { ObjectId } = require('mongodb');
const objectId = require('mongodb').ObjectId;

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
                response.status = false
                resolve(response);
            }
            
        })
    },
    //get 
    getStaff: (dept)=>{

        return new Promise((resolve, reject) => {
            var staff = db.get().collection(process.env.STAFFDB).find({Department: dept.Department}).toArray();
            console.log(staff);
            resolve(staff)
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

    getDepartment: () => {
        var response = {}
        return new Promise( async (resolve, reject) => {
            var dept = await db.get().collection(process.env.DEPTDB).find().toArray();
            resolve(dept);
        })
    },
    
    //departmnet
    getDepartmentId:(deptId) =>{
        return new Promise(async(resolve,reject) => {
            db.get().collection(process.env.DEPTDB).findOne({_id: new ObjectId(deptId) })
            .then((response) =>{
                resolve(response);
            })
        })
    },


    //update department
    updateDept:(deptId,deptData) => {

        var dept = {
            Capacity : deptData.capacity,
            Semesters : deptData.semester,
            HodId : deptData.hodId,
            HodName : deptData.hodName
        }

        return new Promise(async(resolve, reject) => {

            db.get().collection(process.env.DEPTDB).updateOne({
                _id : new ObjectId(deptId)
            }, {
                $set: {
                    Capacity:dept.Capacity,
                    Semesters: dept.Semesters,
                    HodId : dept.HodId,
                    HodName : dept.HodName
                }
            }).
            then((response) =>{
                resolve(response);
            })
        })
    },
    //add syllabus
    addSyllabus: (deptSyllab) => {

    }
}