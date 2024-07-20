const axios = require('axios');
const config = require('../config/config');
const scrapeWebsite = require('../service/webScrapeService');
const writePost = require('../helpers/writePostContent');
const PostContentObj = require('../models/PostContentObj');
const fetchCompanyLogoService = require('./CompanyLogo/fetchCompanyLogo');
const uploadPictureService = require('./CompanyLogo/UploadPictureService');
const fileService = require('../service/FileSystem/FileService');
const dbClient = require('../database/dbClient');

const accessToken = config.accessToken;
const generalImageURN = "urn:li:image:D5610AQHcMPlxJnPyJA";
const path = require('path');

const MODE = {
    TEST: 'TEST',
    DEPLOY: 'DEPLOY'
}

const filterPostByExistingPosts = async (jobPosts) => {
    let eligiblePosts = [];

    const existingPosts = await dbClient.connectToSupabaseAndGetJobs();
    let companyDateTuples = null;
    if (existingPosts === null) {
        console.error("Existing posts are null. Skipping the filter.");
    } else if (jobPosts === null) {
        console.error("Job posts are null. Skipping the filter.");
    }
    else {
        console.log("Existing posts length is:", existingPosts.length);
        console.log("First existing post is:", existingPosts[0]);

        // fetch the company_name: and date_posted: from the existing posts
        companyDateTuples = new Set(existingPosts.map(post => JSON.stringify([post.company_name, post.date_posted, post.role])));

        for (let i = 0; i < jobPosts.length; i++) {
            // console.log("filterPostByExistingPosts) i is:", i);
            let companyName = jobPosts[i].company;
            let postDate = jobPosts[i].postDate;
            let postRole = jobPosts[i].jobTitle;
            let postDateStr = jobPosts[i].postDate.toISOString().split('T')[0];
            // if the tuple of [companyName, postDate] is not in the existing posts, add it to the eligible posts
            if (!companyDateTuples.has(JSON.stringify([companyName, postDateStr, postRole]))) {
                eligiblePosts.push(jobPosts[i]);
            }
        }

        console.log("Eligible posts length is %d for today %s", eligiblePosts.length, new Date().toISOString().split('T')[0]);
    }

    return eligiblePosts;
}

const getWebScrapeDataAndFilter = async () => {
    try {
        const jobPosts = await scrapeWebsite.scrape();
        // filter the job posts by today's date
        const filteredPosts = filterPostByExistingPosts(jobPosts);
        return filteredPosts;
    } catch (error) {
        console.error("getWebScrapeDataAndFilter error is:", error);
    }
}

const getPostContentList = async () => {
    try {
        const eligibleJobPosts = await getWebScrapeDataAndFilter();
        if(eligibleJobPosts === null) {
            console.error("eligibleJobPosts is null. Skipping the post.");
            return [];
        }

        // create a list of post content with PostContentObj
        const postContentList = [];

        for (let i = 0; i < eligibleJobPosts.length; i++) {
            let jobPost = eligibleJobPosts[i];
            let postContent = writePost.writePostContent(eligibleJobPosts[i]);
            let postContentObj = new PostContentObj(
                jobPost,
                postContent);

            postContentList.push(postContentObj);
        }

        return postContentList;
    } catch (error) {
        console.error("getPostContentList error is:", error);
        return [];
    }

}

// the action to publish a post
const publishPostAction = async (postContentObj, imageURN) => {
    try {
        const response = await axios.post('https://api.linkedin.com/rest/posts',
            {
                "author": "urn:li:person:QMGpV_X3Ej",
                "commentary": `${postContentObj.postContent}`,
                "visibility": "PUBLIC",
                "distribution": {
                    "feedDistribution": "MAIN_FEED",
                    "targetEntities": [],
                    "thirdPartyDistributionChannels": []
                },
                "content": {
                    "media": {
                        "altText": `logo for ${postContentObj.jobPost.company}`,
                        "id": `${imageURN}`
                    }
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

        return response;
    } catch (error) {
        console.error("error of posting is:", error);
    }
};

const getPostPicImageURN = async (companyName) => {
    let imageURN = "";

    // fetch the company logo
    const fetchedPhotoUrl = await fetchCompanyLogoService.fetchCompanyLogoAndDownload(companyName);
    if (fetchedPhotoUrl) {
        let fileType = fetchedPhotoUrl.split('.').pop(); // get the file type
        let companyLogoExisted = false;
        let companyNameNoSpace = companyName.replace(/[^a-zA-Z0-9]/g, ''); // remove all special characters

        // check if the company logo is found in resource/company folder
        let companyImageName = `${companyNameNoSpace}.${fileType}`;
        try {
            companyLogoExisted = await fileService.findFileInDirectory(path.resolve(__dirname, `../resource/company/`), companyImageName);
        } catch (error) {
            console.error("fs.readdirSync error is:", error);
            return generalImageURN;
        }

        // if the companyLogoExisted is null, then the company logo is not found, return generalImageURN
        if (companyLogoExisted === null) {
            console.log("Company %s logo is not found in resource/company folder", companyName);
            return generalImageURN;
        }

        // upload the picture to LinkedIn and get the image URN
        if (companyLogoExisted) {
            console.log("Company logo is found in resource/company folder");

            // upload the picture to LinkedIn
            imageURN = await uploadPictureService.performUploadPicture(companyImageName);
            if (imageURN === null) {
                console.error("Image URN is invalid. Skipping the post.");
                imageURN = generalImageURN;
            }

            // write the imageURN to the ./resource/directory/companyToImageURN.txt
            // fileService.appendCompanyToImageURN(companyName, imageURN);
        }
    } else {
        imageURN = generalImageURN;
    }

    return imageURN;
}

const publishPosts = async () => {
    try {
        // get the list of post content
        let postContentList = await getPostContentList();

        // initiate the postContent
        for (let i = 0; i < postContentList.length; i++) {
            let postContentObj = postContentList[i];
            let jobPost = postContentObj.jobPost;
            let companyName = jobPost.company;

            console.log("Company name %d is: %s", i, companyName);
            console.log("Post content %d is: %s", i, postContentObj.postContent);
            const imageURN = await getPostPicImageURN(companyName);

            if (config.mode === MODE.DEPLOY) {
                const response = await publishPostAction(postContentObj, imageURN);
                // if the response is undefined, then the post is not successful, print the error
                if (response === undefined) {
                    console.error("Post response is undefined for %s", companyName);

                    // sleep for 60 seconds before making the next post (set by config)
                    await new Promise(r => setTimeout(r, config.sleepEachPost * 1000));
                    continue;
                }

                console.log("Post response status for %s is: %d", companyName, response.status);
                // if the post is successful, write the company to the supabase database
                if (response.statusText === "Created") {
                    // write the company to the supabase database
                    let postedResult = dbClient.connectToSupabaseAndPostJob(postContentObj.jobPost);
                    console.log("Response for db PostJob for %s is:", companyName, postedResult);
                }
            }

            // sleep for 60 seconds before making the next post (set by config)
            await new Promise(r => setTimeout(r, config.sleepEachPost * 1000));
        }
    } catch (error) {
        console.error("publishPosts error is:", error);
    }

    return null;
};

module.exports = {
    publishPosts
};
