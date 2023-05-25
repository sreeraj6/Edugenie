const { log } = require('debug/src/browser');
const db = require('../../Config/connection');
const { response } = require('../../app');
const { ObjectId, Timestamp } = require('mongodb');
const objectId = require('mongodb').ObjectId;

module.exports = {

    insertDoubt: (doubtData, candidatecode) => {

        var doubt = {
            topic: doubtData.topic,
            sub_id: doubtData.sub_id,
            description: doubtData.description,
            candidatecode: candidatecode,
            deptId: doubtData.deptId,
            statuscode: 1,
            date: new Date()
        }

        return new Promise((resolve, reject) => {
            db.get().collection(process.env.DOUBTDB).insertOne(doubt).then(
                (response) => {
                    resolve(response)
                })
        })
    },

    getDoubtHistory: (candidatecode) => {
        return new Promise(async (resolve, reject) => {
            var history = await db.get().collection(process.env.DOUBTDB).find({ candidatecode: candidatecode }).toArray();
            for (var i = 0; i < history.length; i++) {
                if (history[i].statuscode == 0) {
                    history[i].statuscode = 'Solved'
                }
                else {
                    history[i].statuscode = 'Pending'
                }
            }

            resolve(history);
        })
    },

    rateDoubt: (doubtId, rating) => {

        return new Promise((resolve, reject) => {
            db.get().collection(process.env.DOUBTDB).updateOne({ _id: new ObjectId(doubtId) },
                {
                    $set: {
                        alert: false,
                        rate: parseInt(rating)
                    }
                }).then((response) => {
                    resolve(response)
                })
        })
    }

}