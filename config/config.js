require('dotenv').config();

module.exports = {
    accessToken: process.env.ACCESS_TOKEN,
    mode: process.env.MODE,
    jobEntriesNum: process.env.JOB_ENTRIES_NUM,
    sleepEachPost: process.env.SLEEP_EACH_POST,
    testPostDate: {
        year: process.env.TEST_POST_DATE_YEAR,
        month: process.env.TEST_POST_DATE_MONTH,
        day: process.env.TEST_POST_DATE_DAY
    },
    logoAPIKey: process.env.LOGO_API_KEY,
};