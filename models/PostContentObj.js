// model/Job.js
const addGettersSetters = require('../utils/addGetterAndSetters');

class PostContentObj {
    // articleSource, articleTitle, articleDescription refers to the url/title/description of the shared link
    constructor(jobPost, postContent) {
        this.jobPost = jobPost;
        this.postContent = postContent;
    }
}

const properties = ['jobPost','postContent'];
addGettersSetters(PostContentObj, properties);

module.exports = PostContentObj;
