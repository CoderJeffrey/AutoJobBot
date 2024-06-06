const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function scrape() {
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
        for (let i = 0; i < tables.length; i++) {
            let table = tables[i];
            let tableBody = await table.findElement(By.css('tbody'));
            let tableBodyText = await tableBody.getText();
            await console.log('Table Body:', tableBodyText);
        }


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
})();
