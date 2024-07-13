const publishPostService= require('../service/publishPostService');

const publishPosts = async (req, res) => {
    try {
        console.log("Publishing post...");
        await publishPostService.publishPosts();
    } catch (error) {
        console.error("Error publishing post:", error);
        res.status(500).send("An error occurred while publishing the post.");
    }
};

module.exports = { publishPosts };