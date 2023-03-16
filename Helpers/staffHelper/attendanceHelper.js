const db = require('../../Config/connection');

module.exports = {
    getStudents : (semester,DeptId) => {

        return new Promise(async (resolve,reject) => {
            var students = await db.get().collection(process.env.STUDENTDB).find({
                $and:[
                    {Dept_Id:DeptId},
                    {Semester:semester}
                ]
                }).toArray();
            resolve(students);
        })
    },

    getHours : (DeptId, semester, date) => {

        return new Promise(async (resolve, reject) => {
            var hours = await db.get().collection(process.env.ATTENDANCE).find({
                $and:[
                    {Dept_Id : DeptId},
                    {Semester : semester},
                    {date : date}
                ]
            })
            var initialHour = []; initialHour.length = 7;
            initialHour.fill(true)
            
            resolve(initialHour)
        })
    }
}