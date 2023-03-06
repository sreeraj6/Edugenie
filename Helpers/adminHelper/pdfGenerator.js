var pdf = require("pdf-creator-node");
var fs = require("fs");
const { resolve } = require("path");
const { rejects } = require("assert");

var html = fs.readFileSync("template.html", "utf8");

var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<div style="text-align: center; font-size:30px;">Exam Seat Arrangement Generate By EduGenie</div>'
    },
    footer: {
        height: "28mm",
        contents: {
            first: 'Cover page',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
    }
};

async function generatePdf(timetable){
      var document = {
        html: html,
        data: {
          users: timetable,
        },
        path: "./output.pdf",
        type: "",
      };
    
      await pdf.create(document, options).then((res) => {
        console.log(res);
      })
      .catch((error) => {
        return false
      });
      return true
}

module.exports = generatePdf;