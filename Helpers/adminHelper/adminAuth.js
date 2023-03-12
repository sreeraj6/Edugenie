const db = require('../../Config/connection')
const bcrypt = require('bcrypt')

module.exports = {
    doLogin: (credential) => {
        
        var cred = {
            email: credential.email,
            password: credential.password,
            type: credential.type
        }

        return new Promise(async (resolve, reject) => {
            let response = {}
            let loginStatus = false
            let user;
            if(credential.type == 1){
                user = await db.get().collection(process.env.ADMINDB).findOne({email: cred.email})
            }
            else if(credential.type == 2){
                user = await db.get().collection(process.env.STAFFDB).findOne({email: cred.email})
            }
            else if(credential.type == 3){
                user = await db.get().collection(process.env.STUDENTDB).findOne({email: cred.email})
            }
            else{
                resolve({status: false})
            }
            console.log(user);
            if(user) {
                console.log(user);
                bcrypt.compare(cred.password,user.Password).then((status) => {
                    if(status) {
                        response.user = user;
                        response.status = true;
                        resolve(response)
                    }
                    else{
                        console.log("Something happende");
                        resolve({status: false})
                    }
                })
            }
            else{
                resolve({status: false})
            }
        })
    }
}