const { Builder, By, until } = require('selenium-webdriver');
const config = require('../../config/config');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const { DateStrToDateObj } = require('../../helpers/time');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const tmp_numJobEntriesNum = 30;

const initializeWebDriver = async () => {
    let options = new chrome.Options();
    options.addArguments('--headless'); // Run Chrome in headless mode
    options.addArguments('--no-sandbox');

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    return driver;
}
const scrapeInternshipJobs = async () => {
    // Setup Chrome options
    let driver = await initializeWebDriver();

    try {
        // Navigate to the website
        await driver.get('https://github.com/SimplifyJobs/Summer2025-Internships');

        // Wait until the table is loaded
        try {
            await driver.wait(until.elementLocated(By.css('table tbody tr')), 15000);
        } catch (e) {
            console.log('Table not found.');
            return;
        }

        // print the table body
        let tables = await driver.findElements(By.css('table'));
        let totalTables = tables.length;
        console.log('Total Tables Length:', totalTables);

        // table[0] is for the basic info of the repo (thus we start at 1)
        let table = tables[1];
        let tableBody = await table.findElement(By.css('tbody'));

        // get the <tr> elements
        let rows = await tableBody.findElements(By.css('tr'));
        let totalRows = rows.length;
        console.log('Total Rows Length:', totalRows);

        let jobPosts = [];
        let numJobPostsToCrawl = config.jobEntriesNum;

        // change to int
        numJobPostsToCrawl = parseInt(numJobPostsToCrawl);

        // loop through the first 10 rows
        for (let i = 0; i < numJobPostsToCrawl; i++) {
            let row = rows[i];
            let cells;
            try {
                cells = await row.findElements(By.css('td'));
            } catch (e) {
                console.log(`Skipping job post at row ${i + 1} due to missing cells.`);
                break; // break out of the loop if there are no cells
            }

            let totalCells = cells.length;

            // skip nested companies (↳)
            let company = await cells[0].getText();
            if (company === "↳") {
                console.log(`Skipping job post at row ${i + 1} due to nested company.`);
                continue;
            }

            let jobTitle = await cells[1].getText();
            // if job title includes 🛂 or 🇺🇸, then the job post doesn't offer visa sponsorship or requires US citizenship
            let sponsorship = true;
            if (jobTitle.includes('🛂') || jobTitle.includes('🇺🇸')) {
                sponsorship = false;
            }

            let jobLocation = await cells[2].getText();

            // the third field is an empty field with href to the link for the job post
            let joblink;
            try {
                joblink = await cells[3].findElement(By.css('a')).getAttribute('href');
            } catch (e) {
                console.log(`Skipping job post at row ${i + 1} for company ${company} due to missing job link.`);
                continue; // Skip this iteration if the job link is undefined
            }

            let postDate = await cells[4].getText();

            // convert the date to a Date object
            let postDateObj = DateStrToDateObj(postDate);

            if (i === 0) {
                // print the date for the first job post
                console.log('1st Job Post Date:', postDateObj);
            }

            // create a job post object
            let jobPost = {
                company: company,
                jobTitle: jobTitle,
                jobLocation: jobLocation,
                postDate: postDateObj,
                jobLink: joblink,
                sponsorship: sponsorship,
            };

            // add the job post to the jobPosts array
            jobPosts.push(jobPost);
        }

        return jobPosts;
    } catch (err) {
        console.error(err);
    } finally {
        // Quit the WebDriver
        await driver.quit();
    }
}

const scrapeFullTimeJobs = async () => {
    // Initialize the WebDriver
    let driver = await initializeWebDriver();

    try {
        // Navigate to the website
        await driver.get('https://github.com/SimplifyJobs/New-Grad-Positions');

        // Wait until the table is loaded
        try {
            await driver.wait(until.elementLocated(By.css('table tbody tr')), 15000);
        } catch (e) {
            console.log('Table not found.');
            return;
        }

        // print the table body
        let tables = await driver.findElements(By.css('table'));
        let totalTables = tables.length;
        console.log('Total Tables Length:', totalTables);

        // table[0] is for the basic info of the repo (thus we start at 1)
        let table = tables[1];
        let tableBody = await table.findElement(By.css('tbody'));

        // get the <tr> elements
        let rows = await tableBody.findElements(By.css('tr'));
        let totalRows = rows.length;
        console.log('Total Rows Length:', totalRows);

        let jobPosts = [];

        // TODO: replaced with config.jobEntriesNum
        let numJobPostsToCrawl = parseInt(process.env.JOB_ENTRIES_NUM);

        // loop through the first 10 rows
        for (let i = 0; i < numJobPostsToCrawl; i++) {
            let row = rows[i];
            let cells;
            try {
                cells = await row.findElements(By.css('td'));
            } catch (e) {
                console.log(`Skipping job post at row ${i + 1} due to missing cells.`);
                break; // break out of the loop if there are no cells
            }

            let totalCells = cells.length;

            // skip nested companies (↳)
            let company = await cells[0].getText();
            if (company === "↳") {
                console.log(`Skipping job post at row ${i + 1} due to nested company.`);
                continue;
            }

            let jobTitle = await cells[1].getText();
            // if job title includes 🛂 or 🇺🇸, then the job post doesn't offer visa sponsorship or requires US citizenship
            let sponsorship = true;
            if (jobTitle.includes('🛂') || jobTitle.includes('🇺🇸')) {
                sponsorship = false;
            }

            let jobLocation = await cells[2].getText();

            // the third field is an empty field with href to the link for the job post
            let joblink;
            try {
                joblink = await cells[3].findElement(By.css('a')).getAttribute('href');
            } catch (e) {
                console.log(`Skipping job post at row ${i + 1} for company ${company} due to missing job link.`);
                continue; // Skip this iteration if the job link is undefined
            }

            let postDate = await cells[4].getText();

            // convert the date to a Date object
            let postDateObj = DateStrToDateObj(postDate);

            // create a job post object
            let jobPost = {
                company: company,
                jobTitle: jobTitle,
                jobLocation: jobLocation,
                postDate: postDateObj,
                jobLink: joblink,
                sponsorship: sponsorship,
            };

            // add the job post to the jobPosts array
            jobPosts.push(jobPost);
        }

        return jobPosts;
    } catch (err) {
        console.error(err);
    } finally {
        // Quit the WebDriver
        await driver.quit();
    }
}

const scrapeAllJobs = async () => {
    let internshipJobs = await scrapeInternshipJobs();
    let fullTimeJobs = await scrapeFullTimeJobs();

    // combine two lists into one
    let allJobs = internshipJobs.concat(fullTimeJobs);

    return allJobs;
}

//
// const testScrapeFullTimeJobs = async () => {
//     let jobPosts = await scrapeFullTimeJobs();
//     console.log("jobPosts is:", jobPosts);
// }



module.exports = {
    scrapeAllJobs
};
