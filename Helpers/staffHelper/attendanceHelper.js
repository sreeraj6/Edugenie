const db = require('../../Config/connection');

module.exports = {
    getStudents: (semester, DeptId) => {

        return new Promise(async (resolve, reject) => {
            var students = await db.get().collection(process.env.STUDENTDB).find({
                $and: [
                    { Dept_Id: DeptId },
                    { Semester: semester }
                ]
            }).toArray();
            resolve(students);
        })
    },

    getHours: (DeptId, semester, date) => {

        return new Promise(async (resolve, reject) => {
            var hours = await db.get().collection(process.env.ATTENDANCE).find({
                $and: [
                    { Dept_Id: DeptId },
                    { semester: semester },
                    { date: date }
                ]
            }).toArray();
            console.log(hours);
            var initialHour = []; initialHour.length = 7;
            initialHour.fill(true)

            for (var i = 0; i < hours.length; i++) {
                if (hours[i].zero) initialHour[0] = false
                else if (hours[i].one) initialHour[1] = false
                else if (hours[i].two) initialHour[2] = false
                else if (hours[i].three) initialHour[3] = false
                else if (hours[i].four) initialHour[4] = false
                else if (hours[i].five) initialHour[5] = false
                else if (hours[i].six) initialHour[6] = false
            }
            resolve(initialHour)
        })
    },

    recordeAttendance: (attendanceData, deptId) => {

        function assignpresent(candidatecode, availstud) {
            var arr = []
            for (var i = 0; i < candidatecode.length; i++) {
                var attendance = {}
                if (availstud.includes(candidatecode[i])) {
                    attendance = {
                        present: candidatecode[i]
                    }
                }
                else {
                    attendance = {
                        absent: candidatecode[i]
                    }
                }
                arr.push(attendance);
            }
            return arr;
        }

        var newrecord = {
            date: attendanceData.date,
            semester: attendanceData.semester,
            Dept_Id: deptId,
            subjectId: attendanceData.subjectid
        }


        switch (attendanceData.hour) {
            case '0':
                newrecord.zero = assignpresent(attendanceData.candidateCode, attendanceData.attendance);
                break;
            case '1':
                newrecord.one = assignpresent(attendanceData.candidateCode, attendanceData.attendance);
                break;
            case '2':
                newrecord.two = assignpresent(attendanceData.candidateCode, attendanceData.attendance);
                break;
            case '3':
                newrecord.three = assignpresent(attendanceData.candidateCode, attendanceData.attendance);
                break;
            case '4':
                newrecord.four = assignpresent(attendanceData.candidateCode, attendanceData.attendance);
                break;
            case '5':
                newrecord.five = assignpresent(attendanceData.candidateCode, attendanceData.attendance);
                break;
            case '6':
                newrecord.six = assignpresent(attendanceData.candidateCode, attendanceData.attendance);
                break;
        }


        return new Promise((resolve, reject) => {
            db.get().collection(process.env.ATTENDANCE).insertOne(newrecord).then((response) => {
                response.status = true;
                console.log(response);
                resolve(response);
            })
        })
    }
}