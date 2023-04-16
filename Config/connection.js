const { MongoClient } = require("mongodb");

// Connection URI
const uri = process.env.MONGO_URL;
const dbname = process.env.DBNAME;
// Create a new MongoClient
const client = new MongoClient(uri);
const state = {
    db:null
}
async function run() {
  
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
      
    // Establish and verify connection
    await client.db(dbname).command({ ping: 1 });
    console.log("Connected successfully to cloud DB");
    state.db = client.db(dbname)
  }
  catch{
    console.log("error occured");
  }
  

}
run()


 

module.exports.get = ()=> {
    return state.db
}