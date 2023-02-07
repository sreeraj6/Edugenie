const db = require('../../Config/connection')
const bcrypt = require('bcrypt')

module.exports = {
    doLogin: (adminCred) => {
        var cred = {
            email: adminCred.email,
            password: adminCred.password
        }

        return new Promise(async (resolve, reject) => {
            let response = {}
            let loginStatus = false

            let user = await db.get().collection('admin').findOne({email: cred.email})

            if(user) {
                bcrypt.compare(adminCred.password,user.password).then((status) => {
                    if(status) {
                        response.user = user;
                        response.status = true;
                        resolve(response)
                    }
                    else{
                        resolve({status: false})
                    }
                })
            }
        })
    }
}