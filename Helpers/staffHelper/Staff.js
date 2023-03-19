const db = require('../../Config/connection');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const objectId  = require('mongodb').ObjectId ;
const { Configuration, OpenAIApi } = require("openai");
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
     

     let AttendanceExist= await db.get().collection(process.env.ATTENDANCE).findOne({})
    // console.log("id is",AttendanceExist);
if(AttendanceExist._id==null){
  db.get().collection(process.env.ATTENDANCE).insertOne({_id:new objectId(id)})
}else{
    
    db.get().collection(process.env.ATTENDANCE).updateOne(
     { _id:AttendanceExist._id},

    { 
      $push:
      {
     AttendanceArray:{
    Date:new Date(),
    Name:attendancedata.Name,
    CandidateCode:attendancedata.CandidateCode,
    Count:attendancedata.count,
    
     WorkingHours:{
      Name:attendancedata.Name,
      'firsthour':attendancedata.firstHour,
      'secondhour':attendancedata.secondHour,
      'thirdhour':attendancedata.thirdHour,
      'fourthhour':attendancedata.fourthHour,
      'fifththhour':attendancedata.fifthHour,
      // 'totalHour':attendancedata.TotalHour,
      //  "TotalHours":`${parseInt(attendancedata.TotalHour*60)}minutes`,
      //  "attendancetodayavg":`${parseInt(attendancedata.TotalHours/300*100)}%`
     },
    },
  },
},
     ).then((response)=>{
      
      resolve( response);
     
     }) 
   
  
  // let AttendCount=  await  db.get().collection(process.env.ATTENDANCE).aggregate([
    
    
    
  //       {
          
  //         $project: {
  //           totalHours: {
  //             $sum: [
  //               '$AttendanceArray[0].WorkingHours.firstHour',
  //               // "$AttendanceArray.workingHours.secondhour",
  //               // "$AttendanceArray.workingHours.thirdhour",
  //               // "$AttendanceArray.workingHours.fourthhour",
  //               // "$AttendanceArray.workingHours.fifththhour"
  //             ]
  //           }
  //         }
  //       },
  //       {
  //         $group: {
  //           _id: AttendanceExist._id,
  //           total: { $sum: AttendanceExist.AttendanceArray[4].Count}
  //         }
  //       }
  //     ])
  //     .toArray();
  //     console.log("Aggregate response is" ,AttendCount)
  //     console.log(AttendCount);
  //     resolve(AttendCount);
   

      
             
      
       
      
 

        // {
}
 
    
  
})
  
 



     
},

GetNotes:()=>{
return new Promise(async(resolve, reject) => {
   await db.get().collection(process.env.SYLLABUS).findOne({}).then((Getnotes)=>{
       console.log("getNotes"+Getnotes.module1);
       let Subjectmodule={
        module1:Getnotes.module1,
        module2:Getnotes.module2,
        module3:Getnotes.module3,
        module4:Getnotes.module4,
        module5:Getnotes.module5
        
   }
   resolve(Subjectmodule)
   console.log("module is ",Subjectmodule);
 
   })
 

})
},

receivedContent :(content)=>{
   
    return new Promise(  (resolve, reject) => {
      
     
       

    
     
       
      db.get()
      .collection('chat-gpt')
      .insertOne(content)
      .then((response) => {
        resolve(response+"content added ss")
      })
     
    });
 
   
},


storeNotes :(notes)=>{
  
  return new Promise((resolve, reject) => {
 

    //let Module_Exist=await db.get().collection(process.env.MODULE_NOTES).findOne({})
db.get().collection(process.env.MODULE_NOTES).insertOne(notes).then((response)=>{
  resolve(response)
})
  })
}

// attendanceCount:()=>{
//   return new Promise((resolve, reject) => {
//     db.get().collection(process.env.ATTENDANCE).aggregate([
//       {$count:WorkingHours}
//       // {
//       //     $project: {
//       //         item: 1,
//       //         lessThan10: {  // Set to 1 if value < 10
//       //             $cond: [ { $lt: ["$value", 10 ] }, 1, 0]
//       //         },
//       //         moreThan10: {  // Set to 1 if value > 10
//       //             $cond: [ { $gt: [ "$value", 10 ] }, 1, 0]
//       //         }
//       //     }
//       // },
//       // {
//       //     $group: {
//       //         _id: "$item",
//       //         countSmaller: { $sum: "$lessThan10" },
//       //         countBigger: { $sum: "$moreThan10" }
//       //     }
//       // }
//   ])                                                                                          
  
            
//   })
// },
  
}
