const { log } = require('debug/src/browser');
const db = require('../../Config/connection');

module.exports = {

    monitorAttendance : (candidateCode)=>{

        return new Promise(async(resolve,reject) =>{

            var present = await db.get().collection(process.env.ATTENDANCE).find({$or:[
                {zero:{$elemMatch:{present:candidateCode}}},
                {one:{$elemMatch:{present:candidateCode}}},
                {two:{$elemMatch:{present:candidateCode}}},
                {three:{$elemMatch:{present:candidateCode}}},
                {four:{$elemMatch:{present:candidateCode}}},
                {five:{$elemMatch:{absent:candidateCode}}},
                {six:{$elemMatch:{absent:candidateCode}}}
            ]})
            .toArray();

            var absent = await db.get().collection(process.env.ATTENDANCE).find({$or:[
                {zero:{$elemMatch:{absent:candidateCode}}},
                {one:{$elemMatch:{absent:candidateCode}}},
                {two:{$elemMatch:{absent:candidateCode}}},
                {three:{$elemMatch:{absent:candidateCode}}},
                {four:{$elemMatch:{absent:candidateCode}}},
                {five:{$elemMatch:{absent:candidateCode}}},
                {six:{$elemMatch:{absent:candidateCode}}}
            ]})
            .toArray();

            var res = {
                presentedonclass : present,
                absentedonclass : absent,
                no_present : present.length,
                total : present.length + absent.length
            }
            resolve(res)
        })
    },

    getAssignment: (deptId,semester) => {

        return new Promise(async(resolve, reject) => {
            console.log(semester);
            var assignment = await db.get().collection(process.env.ASSIGNMENT).find({$and:[{deptId:deptId},{statuscode:1},{semester:semester}]}).toArray();
            resolve(assignment);
        })
    }
}