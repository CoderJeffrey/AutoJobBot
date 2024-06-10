const publishPostService= require('../service/publishPostService');
const CircularJSON = require('circular-json');
const fs = require('fs');
const path = require('path');

const publishPost = async (req, res) => {
    try {
        console.log("Publishing post...");
        const postResponse = await publishPostService.publishPost();
        if (!postResponse) {
            // res.status(500).send("An error occurred while publishing the post. 404");
            return;
        }

        // console.log("Post2 response status is:", postResponse.statusText);
        //
        // // Write the post response to a file
        // const circularJSONStr = CircularJSON.stringify(postResponse);
        // console.log("Flatted String:", circularJSONStr);
        //
        // const dir = '../data';
        // if (!fs.existsSync(dir)) {
        //     fs.mkdirSync(dir, { recursive: true });
        // }
        //
        // // get current date and time
        // const now = new Date();
        // const timestamp = now.toISOString();
        // console.log("Timestamp:", timestamp);
        // const filename = `response-${timestamp}.json`;

        // fs.writeFileSync(path.join(dir, filename), circularJSONStr);
    } catch (error) {
        console.error("Error publishing post:", error);
        res.status(500).send("An error occurred while publishing the post.");
    }
};

module.exports = { publishPost };