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
            Dept_Id:staffData.deptId,
            Dept_Name:staffData.deptName,
            Email:staffData.email,
            Gender:staffData.gender,
            createdAt: Date
        }

        return new Promise(async (resolve, reject) => {
            let response = {}
            let find = null;
            find = await db.get().collection(process.env.STAFFDB).findOne({Email: staff.email})

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
    },
    getstaffData: () => {
        return new Promise(async (resolve, reject) => {
          let staffData = await db
            .get()
            .collection(process.env.STAFFDB)
            .find()
            .toArray();
          resolve(staffData);
        });
      },

    //get 
    getDeptStaff: (deptId)=>{
        
        return new Promise(async(resolve, reject) => {
            var staff = await db.get().collection(process.env.STAFFDB).find({Dept_Id: deptId}).toArray();
            resolve(staff)
        })
    },
}