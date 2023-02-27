const db = require('../../Config/connection');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const objectId  = require('mongodb').ObjectId ;

const { response } = require('../../app')

module.exports={

     
ViewAssignment: ()=>{

    return new Promise(async(resolve, reject) => {
        var Assignment =await db.get().collection(process.env.ASSIGNMENT).find().toArray();
        console.log(Assignment);
        resolve(Assignment)
    })
},
getAssignmentDetails: (AssignmentId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(process.env.ASSIGNMENT)
        .findOne({ _id: new objectId(AssignmentId) })
        .then((response) => {
          resolve(response);
          console.log(response+"assign details");
        });
    });
  },
    markAssignments: (assign,id ) => {
        return new Promise(async(resolve, reject) => {
      let studentName= await db.get().collection(process.env.STUDENTDB).findOne({})
        console.log("studentname is",studentName.Name);
      
          db.get()
            .collection(process.env.ASSIGNMENT)
            .updateOne(
              { _id: new objectId(id) },
              {
                $set: {
                 
               
                    NameofAssignment:assign.assigNAME,
                    Assignment:assign.assignFile,
                     checkedState:assign.checked
                },
                
                
              },
             
             
            )
            .then((response) => {
              resolve(response);
               
            });
        });
      },

      addAttendence:(id)=>{
        return new Promise(async(resolve, reject) => {
          let student=await db.get().collection(process.env.STUDENTDB).find().toArray()
            console.log("studentname is",student.Name);
              let subject= await db.get().collection(process.env.SUBJECTDB).findOne({})
              console.log(subject.sub_name)
              let Teacher= await db.get().collection(process.env.STAFFDB).findOne({})

              let display={
                student,
                subjectName:subject.sub_name,
                TeacherName:Teacher.Name
              }
            resolve(display)
        //  var Attendance = {
        //   NameofStudent:studentName.Name,
        //   attentanceStatus:uploadData.assigNAME,
        //   Assignment:uploadData.assignFile
        //  }
        })
      },
AttendanceRecord:(attendancedata,id)=>{
  return new Promise(async(resolve, reject) => {
     
   var Attendance={
    Date:new Date(),
    Name:attendancedata.Name,
    CandidateCode:attendancedata.CandidateCode,
    Count:attendancedata.count,
    
     WorkingHours:{
      Name:attendancedata.Name,
      'Isthour':attendancedata.firstHour,
      '2ndhour':attendancedata.secondHour,
      '3rdhour':attendancedata.thirdHour,
      '4thhour':attendancedata.fourthHour,
      '5thhour':attendancedata.fifthHour,
     },
    
    // TotalHours:""
    
      
    

   }

    // run bulk operations

  //  if(WorkingHours==null){
    db.get().collection(process.env.ATTENDANCE).insertOne(Attendance).then((response) => {
      response.user = false;
      console.log(response);
      resolve(response);
      
  })
// }else{
//    db.get().collection(process.env.ATTENDANCE).insertMany(WorkingHours, function(err, res) {
//     if (err) throw err;
//     console.log("Number of documents inserted: " + res.insertedCount);
//     db.close();
    
   
//  })

// }

// else{
//   db.get().collection(process.env.ATTENDANCE).insertOne(Attendance).then((response) => {
//     response.user = false;
//     console.log(response);
//     resolve(response);
// })
// }

//.then((response) => {
//     response.user = false;
//     console.log(response);
//     console.log("'count is",response.insertedCount);
//     resolve(response);
// })

})

}
      
}