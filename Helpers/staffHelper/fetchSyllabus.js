const { ObjectId } = require('mongodb');
const { response } = require('../../app');
const db = require('../../Config/connection');

module.exports = {
    getModule: (subjectId) => {
        
        return new Promise(async (resolve, reject) => {
            console.log(subjectId);
            db.get().collection(process.env.SYLLABUS).findOne({subject_id:subjectId})
            .then((response) => {
                resolve(response);
            })
        })
        
    },

    saveNotes: (notes) => {
        
    }
}