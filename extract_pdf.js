const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('public/SGK/SGK-HDTN-10-KNTT.pdf');

pdf(dataBuffer).then(function (data) {
    // number of pages
    console.log("Pages:", data.numpages);
    // PDF text
    console.log("Text Preview:", data.text.substring(0, 2000));

    // Save to file for further analysis
    fs.writeFileSync('extracted_sgk10.txt', data.text);
    console.log("Extracted text saved to extracted_sgk10.txt");
}).catch(err => {
    console.error("Error:", err);
});
