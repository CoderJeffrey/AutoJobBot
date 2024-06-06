const axios = require('axios');
const config = require('../config/config');


const accessToken = config.accessToken;
console.log("accessToken is:", accessToken);

const publishPost = async () => {
    try {
        const random = Math.floor(Math.random() * 1000);
        let postContent = `This is a test post using LinkedIn API ${random}`;

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

module.exports = {
    publishPost
};
