const { ObjectId } = require('mongodb');
const { response } = require('../../app');
const db = require('../../Config/connection');

module.exports = {
    getModule: (subjectId) => {
        
        return new Promise(async (resolve, reject) => {
            console.log(subjectId);
           await db.get().collection(process.env.SYLLABUS).findOne({ })
            .then((response) => {
                console.log("res");
                resolve( response);
            })
        })
        
    },

    getSyllabusInfo : (deptId) => {
        
    }
}