const { Builder, By, until } = require('selenium-webdriver');
const config = require('../config/config');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

const { DateStrToDateObj } = require('../helpers/time');

const submitApplicationAction = async (applicationForm) => {
    // submit the application form
    await applicationForm.submit();
}

const uploadResume = async (driver, resumeButton) => {
    const filePath = path.resolve(__dirname, '../resource/Resume_Tech_Buddy.pdf');

    // print the exact path of the file
    console.log('File Path:', filePath);

    // check how many input fields are present
    let resumeFileInputFields = await driver.findElements(By.css('input[type="file"]'));
    console.log('2) Resume File Input Fields Length:', resumeFileInputFields.length);

    // loop through the input fields
    for (let i = 0; i < resumeFileInputFields.length; i++) {
        let resumeFileInputField = resumeFileInputFields[i];

        // the first one is to upload the resume and the second one is to upload the cover letter
        if(i === 0) {
            await resumeFileInputField.sendKeys(filePath);
        }
    }
}


async function submitApplicationForGreenBoard() {
    // Setup Chrome options
    let options = new chrome.Options();
    options.addArguments('--headless'); // Run Chrome in headless mode

    // Initialize the WebDriver
    // let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Navigate to the website
        await driver.get('https://boards.greenhouse.io/verkada/jobs/4128987007');

        // Wait until the table is loaded
        await driver.wait(until.elementLocated(By.css('form')), 10000);

        let resumeFileInputFields = await driver.findElements(By.css('input[type="file"]'));
        console.log('1) Resume File Input Fields Length:', resumeFileInputFields.length);

        // loop through the input fields
        for (let i = 0; i < resumeFileInputFields.length; i++) {
            let resumeFileInputField = resumeFileInputFields[i];
            let text = await resumeFileInputField.getAttribute('outerHTML');
            console.log('1) Resume File Input Field Text:', text);
        }

        // get the application form with the id "application_form"
        let applicationForm = await driver.findElement(By.css('form#application_form'));

        // print the length of the application form
        let applicationFormText = await applicationForm.getText();

        let mainFields = await applicationForm.findElement(By.css('div#main_fields'));
        let customFields = await applicationForm.findElement(By.css('div#custom_fields'));
        // let mainFieldsText = await mainFields[0].getText();
        // let customFieldsText = await customFields[0].getText();


        // // get the input fields
        let mainInputFields = await mainFields.findElements(By.css('input'));


        // loop through the main fields input fields
        for (let i = 0; i < mainInputFields.length; i++) {
            let mainInputField = mainInputFields[i];
            let mainInputFieldAttributes = await mainInputField.getAttribute('id');
            // console.log('Input Field Attributes:', mainInputFieldAttributes);

            // for the first input field, enter the value "John Doe"
            if(mainInputFieldAttributes === 'first_name') {
                await mainInputField.sendKeys('Tech');
            }

            // for the last input field, enter the value "Buddy"
            if(mainInputFieldAttributes === 'last_name') {
                await mainInputField.sendKeys('Buddy');
            }

            // for the email input field, enter the value "TechBuddy@gmail.com"
            if(mainInputFieldAttributes === 'email') {
                await mainInputField.sendKeys('jeffreyliu@gmail.com');
            }

            // phone filed, enter the value "1234567890"
            if(mainInputFieldAttributes === 'phone') {
                await mainInputField.sendKeys('2134567890');
            }
        }

        // upload the resume
        let resumeFieldSet = await mainFields.findElement(By.css('fieldset#resume_fieldset'));
        let resumeFieldSetText = await resumeFieldSet.getText();

        let resumeContainer = await resumeFieldSet.findElement(By.css('div.link-container'));
        let resumeContainerText = await resumeContainer.getText();
        // console.log('Resume Container Text:', resumeContainerText);

        // find all the buttons in the resume container
        let resumeButtons = await resumeContainer.findElements(By.css('button'));
        // console.log('Resume Buttons Length:', resumeButtons.length);

        // loop through the buttons
        for (let i = 0; i < resumeButtons.length; i++) {
            let resumeButton = resumeButtons[i];
            let resumeButtonText = await resumeButton.getText();

            // if the button text is "Upload Resume", click the button
            console.log(`Resume Button Text: *${resumeButtonText}*`);

            if(resumeButtonText.toLowerCase() === 'attach') {
                console.log('Clicking the Attach button');
                await uploadResume(driver, resumeButton);
            }
        }


        // loop through the custom fields input fields
        let customInputFields = await customFields.findElements(By.css('div.field'));
        console.log('\n\nCustom Input Fields Length:', customInputFields.length);

        for (let i = 0; i < customInputFields.length; i++) {
            // every input field has a label and 3 input fields (hidden, hidden, text)
            let customInputField = customInputFields[i];

            // get the label
            let label = await customInputField.findElement(By.css('label'));
            let labelText = await label.getText();
            console.log('Label Text:', labelText);

            // get the input fields
            let customInputSubFields = await customInputField.findElements(By.css('input'));
            console.log('Input Fields Length:', customInputSubFields.length);

            // filter the input fields with type text
            for (let j = 0; j < customInputSubFields.length; j++) {
                let customInputSubField = customInputSubFields[j];
                let customInputSubFieldType = await customInputSubField.getAttribute('type');
                console.log('Input Field Type:', customInputSubFieldType);

                // for the first input field, enter the value "San Francisco"
                if(customInputSubFieldType === 'text') {
                    // use case insensitive comparison if the label text is LinkedIn then enter the value "https://www.linkedin.com/in/techbuddy"
                    switch (labelText.toLowerCase()) {
                        case 'linkedin profile':
                            await customInputSubField.sendKeys('https://www.linkedin.com/in/techbuddy');
                            break;
                        case 'website':
                            await customInputSubField.sendKeys('https://www.techbuddy.com');
                            break;
                        default:
                            console.log(`No matching label text found for ${labelText}`);
                    }
                }
            }

        }

        // sleep for 10s to avoid the bot detection
        await driver.sleep(10000);

        // submit the application
        await submitApplicationAction(applicationForm);

    } catch (err) {
        console.error(err);
    } finally {
        // Quit the WebDriver
        // await driver.quit();
    }
}

submitApplicationForGreenBoard();

// module.exports = { scrape };
