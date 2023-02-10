const db = require('../../Config/connection');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb')
const { response } = require('../../app')

module.exports = {
    addStaff: (staffData) => {
        var staff = {
            Name:staffData.sfName,
            Phone:staffData.phone,
            Experience:staffData.experience,
            DateOfJoining:staffData.date,
            Qualification:staffData.qualification,
            Address:staffData.address,
            Department:staffData.sfDept,
            Email:staffData.email,
            Gender:staffData.gender
        }
        console.log(staff);

        return new Promise(async (resolve, reject) => {
            let response = {}
            let find = null;
            //find = await db.get().collection('staff').findOne({email: DataTransfer.email})

            if(find){
                response.user = true
                resolve(response);
            }
            else {
                staff.Password = await bcrypt.hash(staff.Phone, 10);
                db.get().collection(process.env.STAFFDB).insertOne(staff).then((response) => {
                    response.user = false;
                    console.log(response);
                    resolve(response);
                })
            }
        })
    }
}