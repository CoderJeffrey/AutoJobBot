const publishPostService= require('../service/publishPostService');
const CircularJSON = require('circular-json');
const fs = require('fs');
const path = require('path');

const publishPost = async (req, res) => {
    try {
        console.log("Publishing post2...");
        const postResponse = await publishPostService.publishPost();
        // if postResponse is not undefined, then stringify it using CircularJSON
        if (!postResponse) {
            res.status(500).send("An error occurred while publishing the post. 404");
            return;
        }

        console.log("Post2 response status is:", postResponse.statusText);

        const circularJSONStr = CircularJSON.stringify(postResponse);
        console.log("Flatted String:", circularJSONStr);

        const dir = '../data';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(path.join(dir, 'response.json'), circularJSONStr);

        res.send(`Post published: ${circularJSONStr}`);
    } catch (error) {
        console.error("Error publishing post:", error);
        res.status(500).send("An error occurred while publishing the post.");
    }
};

module.exports = { publishPost };