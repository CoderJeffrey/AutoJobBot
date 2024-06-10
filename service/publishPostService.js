const axios = require('axios');
const config = require('../config/config');
const scrapeWebsite = require('../service/webScrapeService');
const writePost = require('../helpers/writePostContent');

const accessToken = config.accessToken;

const getWebScrapeData = async () => {
    try {
        const jobPosts = await scrapeWebsite.scrape();
        // get the first 3 job posts
        let firstThreeJobPosts = jobPosts.slice(0, 3);
        console.log("First 3 Job Posts are:", firstThreeJobPosts);
        return jobPosts;
    } catch (error) {
        console.error("error is:", error);
    }
}

const getPostContent = async () => {
    try {
        const jobPosts = await getWebScrapeData();
        // get the first job post
        let firstJobPost = jobPosts[0];

        let postContent = writePost.writePostContent(firstJobPost);
        console.log("For Job %d the post content is: %s", 0, postContent);

        return postContent;
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
        // get the post content
        let postContent = await getPostContent();

        // initiate the postContent
        const response = await publishPostAction(postContent);
        console.log("Post response status from Service is:", response.statusText);
        return response;
    } catch (error) {
        console.error("error is:", error);
    }
};

module.exports = {
    publishPost
};
