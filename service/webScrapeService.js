const { Builder, By, until } = require('selenium-webdriver');
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
        await driver.get('https://github.com/SimplifyJobs/Summer2024-Internships');

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

        // loop through the first 10 rows
        for (let i = 0; i < 10; i++) {
            console.log('Row:', i)
            let row = rows[i];
            let cells = await row.findElements(By.css('td'));
            let totalCells = cells.length;

            let company = await cells[0].getText();

            // get the job title and post date from the first row
            let jobTitle = await cells[1].getText();

            let jobLocation = await cells[2].getText();

            // the third field is an empty field with href to the link for the job post
            let joblink = await cells[3].
                findElement(By.css('a')).
                getAttribute('href');

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
