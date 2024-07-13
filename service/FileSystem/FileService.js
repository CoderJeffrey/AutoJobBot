const fs = require('fs');
const path = require('path');

const findFileInDirectory = async (directory, fileName) => {
    let files = fs.readdirSync(directory);
    for (let i = 0; i < files.length; i++) {
        // case-insensitive search
        if (files[i].toLowerCase().includes(fileName.toLowerCase())) {
            return files[i];
        }
    }
    return null;
}
const appendCompanyToImageURN = (companyName, imageURN) => {
    let filePath = path.resolve(__dirname, '../../resource/directory/companyToImageURN.txt');
    // check if companyName already exists in the file
    let dataRead = fs.readFileSync(filePath, 'utf8');
    if (dataRead.includes(companyName)) {
        return;
    }
    let dataWrite = `${companyName}:${imageURN}\n`;
    fs.appendFileSync(filePath, dataWrite);
}

module.exports = {
    findFileInDirectory, appendCompanyToImageURN
}