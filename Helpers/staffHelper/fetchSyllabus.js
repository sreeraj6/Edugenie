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
        var data = {
            topic : notes.topic,
            note : notes.notes,
            sub_id : notes.sub_id
        }
        var response = {}
        return new Promise(async (resolve, reject) => {
            var exist = await db.get().collection(process.env.NOTE).findOne({topic:data.topic});
            if(exist) {
                response.status = false;
                resolve(response);
            }
            else {
                db.get().collection(process.env.NOTE).insertOne(notes)
                    .then((response) => {
                    response.status = true;
                    resolve(response);
                })
            } 
        })
    },

    getNote: (notedata) => {
        var data = notedata.split(",");
        var topicName = data[1];
        var subid = data[0];
        console.log(topicName+" "+subid);
        return new Promise(async (resolve, reject) => {
            db.get().collection(process.env.NOTE).findOne({$and:[
                {topic:topicName},
                {sub_id:subid}
            ]})
            .then((response) => {
                if(response){
                    resolve(response);
                }
                else{
                    resolve(response)
                }
            })
        })
    }
}