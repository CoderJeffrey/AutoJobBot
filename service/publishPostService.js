const axios = require('axios');
const config = require('../config/config');
const scrapeWebsite = require('../service/webScrapeService');
const writePost = require('../helpers/writePostContent');

const accessToken = config.accessToken;

const MODE = {
    TEST: 'TEST',
    DEPLOY: 'DEPLOY'
}

const filterPostByToday = (jobPosts) => {
    let todayPosts = [];

    // get the list of job posts that match today's year/month/day

    let todayDate = null;
    if (config.mode === MODE.DEPLOY) {
        // (deployment) set today's date to the current date
        console.log("This is mode:", config.mode);
        todayDate = new Date();
    } else {
        // (testing) set today's date to 2024/5/5
        console.log("This is mode:", config.mode);

        // month is 0-based (0 is January, 1 is February, etc.) thus -1
        console.log("Test Post Date:", config.testPostDate.year, config.testPostDate.month, config.testPostDate.day)

        todayDate = new Date(
            parseInt(config.testPostDate.year),
            parseInt(config.testPostDate.month) - 1,
            parseInt(config.testPostDate.day));
    }

    // use LA time zone
    let formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    let parts =  formatter.formatToParts(todayDate);
    let todayYear = parseInt(parts.find(part => part.type === 'year').value);
    let todayMonth = parseInt(parts.find(part => part.type === 'month').value);
    let todayDay = parseInt(parts.find(part => part.type === 'day').value);
    let todayHour = parseInt(parts.find(part => part.type === 'hour').value);
    let todayMinute = parseInt(parts.find(part => part.type === 'minute').value);

    for (let i = 0; i < jobPosts.length; i++) {
        let postDate = jobPosts[i].postDate;
        console.log("Post %d date: %s/%s/%s", i, postDate.getFullYear(), postDate.getMonth() + 1, postDate.getDate());

        if (postDate.getFullYear() === todayYear
            && postDate.getMonth() + 1 === todayMonth
            && postDate.getDate() === todayDay) {
            console.log("Post %d matches today's date", i);
            console.log("Post %d date: %s/%s/%s", i, postDate.getFullYear(), postDate.getMonth() + 1, postDate.getDate());

            todayPosts.push(jobPosts[i]);
        }
    }

    return todayPosts;
}

const getWebScrapeData = async () => {
    try {
        const jobPosts = await scrapeWebsite.scrape();
        // filter the job posts by today's date
        const filteredPosts = filterPostByToday(jobPosts);
        return filteredPosts;
    } catch (error) {
        console.error("error is:", error);
    }
}

const getPostContentList = async () => {
    try {
        const jobPosts = await getWebScrapeData();
        const postContentList = [];

        for (let i = 0; i < jobPosts.length; i++) {
            let postContent = writePost.writePostContent(jobPosts[i]);
            postContentList.push(postContent);
        }

        return postContentList;
    } catch (error) {
        console.error("error is:", error);
    }

}

// the action to publish a post
const publishPostAction = async (postContent) => {
    try {
        const response = await axios.post('https://api.linkedin.com/rest/posts', {
            "author": "urn:li:person:QMGpV_X3Ej",
            "commentary": `${postContent}`,
            "visibility": "PUBLIC",
            "distribution": {
                "feedDistribution": "MAIN_FEED",
                "targetEntities": [],
                "thirdPartyDistributionChannels": []
            },
            "lifecycleState": "PUBLISHED",
            "isReshareDisabledByAuthor": false
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0',
                'LinkedIn-Version': '202403'
            }
        });
        console.log("Post response status from Service is:", response.statusText);
        return response;
    } catch (error) {
        console.error("error is:", error);
    }
};


const publishPost = async () => {
    try {
        // get the list of post content
        let postContentList = await getPostContentList();

        // initiate the postContent
        for (let i = 0; i < postContentList.length; i++) {
            let postContent = postContentList[i];
            console.log("Post content %d is: %s", i, postContent);

            if (config.mode === MODE.DEPLOY) {
                const response = await publishPostAction(postContent);
                console.log("Post response status from Service is:", response.statusText);
            }

            // sleep for 15 seconds before making the next post (set by config)
            await new Promise(r => setTimeout(r, config.sleepEachPost * 1000));
        }
    } catch (error) {
        console.error("error is:", error);
    }

    return null;
};

module.exports = {
    publishPost
};
