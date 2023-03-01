const { ObjectId } = require('mongodb');
const { response } = require('../../app');
const db = require('../../Config/connection');
const deptController = require('./aboutDept');

module.exports = {
    addHall: (hallData) => {

        var hall = {
            hall_no: hallData.hall_no,
            bench: parseInt(hallData.bench),
            maxCapacity: parseInt(hallData.maxcapacity)
        }

        return new Promise((resolve, reject) => {

            db.get().collection(process.env.HALLDB).insertOne(hall).then(
                (response) => {
                    resolve(response);
                }
            )
        })
    },


    generateAllotment: async (studentData, hallData) => {
        console.log(studentData);
        console.log(hallData);

        let bench = studentData.studperBench;
        var halls = hallData.length;
        var dept = await deptController.getDepartment();
        var totaldept = dept.length;

        var hall = [];
        var hall_no = [];
        var len = 0;
        for (var i = 0; i < hallData.length; i++) {
            var found = await db.get().collection(process.env.HALLDB).findOne({ hall_no: hallData[i] });
            if (found != null) {
                hall_no[len] = hallData[i];
                hall[len] = await db.get().collection(process.env.HALLDB).findOne({ hall_no: hallData[i] });
                len++;
            }
        }

        //console.log(dept);
        var sum = 0;
        var students = [];
        for (var i = 0; i < totaldept; i++) {
            students[i] = await db.get().collection(process.env.STUDENTDB).find({ Department: dept[i].Name }).toArray();
            sum += students[i].length;
        }





        // input 2d array
        const arr2d = students

        // shuffle each row independently
        const shuffled2d = arr2d.map(row => {
            const shuffledRow = row.slice(); // make a copy
            for (let i = shuffledRow.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledRow[i], shuffledRow[j]] = [shuffledRow[j], shuffledRow[i]];
            }
            return shuffledRow;
        });

        // flatten and re-arrange 1d array
        let flattened = [];
        for (let i = 0; i < shuffled2d[0].length; i++) {
            for (let j = 0; j < shuffled2d.length; j++) {
                if (i < shuffled2d[j].length) {
                    flattened.push(shuffled2d[j][i]);
                }
            }
        }

        // check that no two consecutive elements are from the same row
        for (let i = 1; i < flattened.length; i++) {
            const row1 = shuffled2d.findIndex(row => row.includes(flattened[i - 1]));
            const row2 = shuffled2d.findIndex(row => row.includes(flattened[i]));
            if (row1 === row2) {
                console.log(`Error: element ${flattened[i - 1]} and ${flattened[i]} are from the same row`);
                break;
            }
        }

       
        console.log(sum);


        var cnt = 0;

        for(var i = 0; i < hall.length && cnt < flattened.length; i++){
            console.log("I am repeated");
            var availBench = hall[i].bench;
            for(var j = 0; j < availBench && cnt < flattened.length; j++){
                console.log("Bench "+j);
                for(var k = 0; k < bench && cnt < flattened.length; k++){
                    process.stdout.write(hall_no[i] + " "+ flattened[cnt].candidateCode+" "+flattened[cnt].Department+" ")
                    cnt++;
                }
                console.log();
            }
        }

        if(cnt < flattened.length){
            console.log("Class room needed");
        }
    }
}