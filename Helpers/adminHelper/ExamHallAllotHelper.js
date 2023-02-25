const { response } = require('../../app');
const db = require('../../Config/connection');

module.exports = {
    addHall: (hallData) =>{

        var hall = {
            hall_no:hallData.hall_no,
            bench: parseInt(hallData.bench),
            maxCapacity: parseInt(hallData.maxcapacity)
        }

        return new Promise((resolve,reject) => {

            db.get().collection(process.env.HALLDB).insertOne(hall).then(
                (response) =>{
                    resolve(response);
                }
            )
        })
    }
}