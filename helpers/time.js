const year = new Date().getFullYear();

// create a map of month names (first 3 characters) to their corresponding numbers
const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11
};

// turn the monthMap into a string
const monthStrToNum = (monthStr) => {
    return monthMap[monthStr];
}

const DateStrToDateObj = (DateStr) => {
    let dateParts = DateStr.split(' ');
    let month = monthStrToNum(dateParts[0]);
    let day = parseInt(dateParts[1]);
    return new Date(year, month, day);
}

module.exports = {
    DateStrToDateObj
}