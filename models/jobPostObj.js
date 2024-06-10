// model/Job.js
const addGettersSetters = require('../utils/addGetterAndSetters');

class JobPostObj {
    constructor(company, jobTitle, jobLocation, postDate, jobLink) {
        this.company = company;
        this.jobTitle = jobTitle;
        this.jobLocation = jobLocation;
        this.postDate = postDate;
        this.jobLink = jobLink;
    }
}

const properties = ['company', 'jobTitle', 'jobLocation', 'postDate', 'jobLink'];
addGettersSetters(JobPostObj, properties);

module.exports = JobPostObj;
