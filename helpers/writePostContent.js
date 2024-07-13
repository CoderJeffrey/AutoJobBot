// writePostContent.js
function writePostContent(jobPost) {
    const postYear = jobPost.postDate.getUTCFullYear();
    const postMonth = jobPost.postDate.getUTCMonth() + 1;
    const postDay = jobPost.postDate.getUTCDate();

    const postContent = `
Want to earn $10K+/month next summer? 🤔️

Apply to ${jobPost.company}'s ${jobPost.jobTitle} now
Application Link: ${jobPost.jobLink}  

➡️ Follow for more updates like this!
↘️ Drop your email below and I will send you Resume Templates that get me into Amazon, LinkedIn and Google! 🚀️
⬇️ Or I get lazy and forget to send 😂️
#JobAlert #${jobPost.company} #Internship #NewGrad
`;

    return postContent;
}

function writeArticleSource(jobPost) {
    const articleSource = `${jobPost.jobLink}`;
    return articleSource;
}

const writeArticleTitle = (jobPost) => {
    const articleTitle = `${jobPost.company}`;
    return articleTitle;
}

const writeArticleDescription = (jobPost) => {
    const articleDescription = `${jobPost.jobTitle}`;
    return articleDescription;
}


module.exports = { writePostContent , writeArticleSource, writeArticleTitle, writeArticleDescription };
