const { ObjectId } = require('mongodb');
const db = require('../../Config/connection');
module.exports = {

    addSubject: (subjectData) => {
        var subject = {
            sub_name: subjectData.subject,
            modules: subjectData.modules,
            semester: subjectData.semester,
            Dept_Id: subjectData.Dept
        }
        return new Promise(async (resolve, reject) => {
            var response = {}
            if(subject.sub_name == '' || subject.Dept_Id == " "){
                response.status = false;
                response.code = 'required fields are empty'
                resolve(response);
            }
            var exist = null
            exist = await db.get().collection(process.env.SUBJECTDB).findOne({ $and: [{ sub_name: subject.sub_name }, { Dept_Id: subject.Dept_Id }] })
            
            if (exist) {
                response.code = 'already exist'
                response.status = false;
                resolve(response);
            }

            else{
                db.get().collection(process.env.SUBJECTDB).insertOne(subject).then((response)=>{
                    response.status = true
                    resolve(response);
                })
            }

        })
    },

    getSubject : (deptId) => {

        return new Promise(async (resolve,reject) => {
            console.log(deptId);
            var subject = await db.get().collection(process.env.SUBJECTDB).find({Dept_Id: deptId}).toArray();
            console.log(subject);
            resolve(subject);
        })
    }
}