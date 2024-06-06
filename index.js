const express = require('express');
const app = express();
const axios = require('axios');
const dotenv = require('dotenv');
const flatted = require('flatted');
const CircularJSON = require('circular-json');
const fs = require('fs');
const path = require('path');
const port = 3000;

// Load environment variables from .env file
dotenv.config();

app.get('/', async (req, res) => {
    try {
        const postResponse = await publishPost();
        console.log("Post2 response status is:", postResponse.statusText);

        // Use flatted to stringify the object (this will handle circular references)
        const circularJSONStr = CircularJSON.stringify(postResponse);
        console.log("Flatted String:", circularJSONStr);

        // Ensure the directory exists
        const dir = './data';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Save the response string to a file named response.json
        fs.writeFileSync(path.join(dir, 'response.json'), circularJSONStr);


        // console.log("*******\n\n\nParsed String:", parsedString);
        res.send(`Post published: ${circularJSONStr}`);
    } catch (error) {
        console.error("Error publishing post:", error);
        res.status(500).send("An error occurred while publishing the post.");
    }
});

// define access token for my account
const accessToken = process.env.ACCESS_TOKEN;
console.log("accessToken is:", accessToken);

const publishPost = async () => {
    // generate a random number to be used in the post
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
        console.log("Post response status is:", response.statusText);
        return response;

    } catch (error) {
        console.error("error is:", error);
    }
}

module.exports = { publishPost };

// Conditionally start the server if this module is run directly
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}