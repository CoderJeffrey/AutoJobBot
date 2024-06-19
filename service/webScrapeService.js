const { Builder, By, until } = require('selenium-webdriver');
const config = require('../config/config');
const chrome = require('selenium-webdriver/chrome');

const { DateStrToDateObj } = require('../helpers/time');

async function scrape() {
    // Setup Chrome options
    let options = new chrome.Options();
    options.addArguments('--headless'); // Run Chrome in headless mode

    // Initialize the WebDriver
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // Navigate to the website
        await driver.get('https://github.com/SimplifyJobs/Summer2025-Internships');

        // Wait until the table is loaded
        await driver.wait(until.elementLocated(By.css('table tbody tr')), 10000);

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

            let company = await cells[0].getText();

            // get the job title and post date from the first row
            let jobTitle = await cells[1].getText();

            let jobLocation = await cells[2].getText();
            console.log("company:", company, " | jobTitle:", jobTitle, " | jobLocation:", jobLocation);

            // the third field is an empty field with href to the link for the job post
            let joblink;
            try {
                joblink = await cells[3].findElement(By.css('a')).getAttribute('href');
            } catch (e) {
                console.log(`Skipping job post at row ${i + 1} due to missing job link.`);
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
                jobLink: joblink
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

// scrape();

module.exports = { scrape };
