// model/Job.js
const addGettersSetters = require('../utils/addGetterAndSetters');

class PostContentObj {
    // articleSource, articleTitle, articleDescription refers to the url/title/description of the shared link
    constructor(postContent, articleSource, articleTitle, articleDescription) {
        this.postContent = postContent;
        this.articleSource = articleSource;
        this.articleTitle = articleTitle;
        this.articleDescription = articleDescription;
    }
}

const properties = ['postContent', 'articleSource', 'articleTitle', 'articleDescription'];
addGettersSetters(PostContentObj, properties);

module.exports = PostContentObj;
