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

        for (let i = 0; i < 10; i++) {
            console.log('Row:', i)
            let row = rows[i];
            let cells = await row.findElements(By.css('td'));
            let totalCells = cells.length;
            console.log('Total Cells Length:', totalCells);

            let company = await cells[0].getText();
            console.log('%d: Company: %s', i, company);

            // get the job title and post date from the first row
            let jobTitle = await cells[1].getText();
            console.log('%d: Job Title: %s', i, jobTitle);

            let jobLocation = await cells[2].getText();
            console.log('%d: Job Location: %s', i, jobLocation);

            let postDate = await cells[4].getText();
            console.log('%d: Post Date: %s', i, postDate);

            // convert the date to a Date object
            let postDateObj = DateStrToDateObj(postDate);
            console.log('%d: Post Date Object: %s', i, postDateObj);

            // the date minus 1 day
            let postDateMinusOneDay = new Date(postDateObj);
            postDateMinusOneDay.setDate(postDateObj.getDate() - 1);
            console.log('%d: Post Date Minus One Day: %s', i, postDateMinusOneDay);
        }

        // print the table body
        // let tableBodyText = await tableBody.getText();
        // // print the top 1000 characters of the table body
        // await console.log('Table Body:\n', tableBodyText.substring(0, 1000));

        // Locate the first row of the table
        // let firstRow = await driver.findElement(By.css('table tbody tr'));
        //
        // // print
        //
        // // Get the job title and post date from the first row
        // let jobTitle = await firstRow.findElement(By.css('td:nth-child(1)')).getText();
        // let postDate = await firstRow.findElement(By.css('td:nth-child(4)')).getText();
        //
        // console.log('Job Title:', jobTitle);
        // console.log('Post Date:', postDate);
    } catch (err) {
        console.error(err);
    } finally {
        // Quit the WebDriver
        await driver.quit();
    }
}

scrape();

module.exports = { scrape };
