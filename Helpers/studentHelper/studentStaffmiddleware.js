const db = require('../../Config/connection');
const { response } = require('../../app');
const objectId = require('mongodb').ObjectId;


module.exports={ 

    insertDoubt: (doubtData,candidatecode) => {

        var doubt = {
            topic : doubtData.topic,
            sub_id: doubtData.sub_id,
            description: doubtData.description,
            candidatecode: candidatecode,
            deptId: doubtData.deptId,
            statuscode: 1
        }

        return new Promise((resolve,reject) => {
            db.get().collection(process.env.DOUBTDB).insertOne(doubt).then(
                (response)=>{
                    resolve(response)
                })
        })
    }

}