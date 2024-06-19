// writePostContent.js
function writePostContent(jobPost) {
    // print the postDate received
    console.log('Post Date received is:', jobPost.postDate);
    console.log('Link received is:', jobPost.jobLink);
    const postYear = jobPost.postDate.getUTCFullYear();

    // In JavaScript, months are zero-indexed, which means January is 0, February is 1, and so on. Therefore, when you call getUTCMonth(), it returns a value between 0 and 11
    // Thus, we need to add 1 to the month to get the correct month
    const postMonth = jobPost.postDate.getUTCMonth() + 1;
    const postDay = jobPost.postDate.getUTCDate();

    const postContent = `
🚀 Exciting Summer 2025 Internship Alert! 🚀

${jobPost.company} just released its ${jobPost.jobTitle} role 

Something to know about:
1. The role is based in ${jobPost.jobLocation}.
2. The role was posted on ${postMonth}/${postDay}/${postYear}.
3. The position is usually filled within 48 hours, so apply NOW! NOW! NOW!

Here's the link: ${jobPost.jobLink}

FYI: Some Internship closes within 2 hours 🚨, so apply early & follow me for most up-to-date internship/job 💼 opportunities.

#Internship #JobOpportunity #JobSearch #ComputerScience #SoftwareEngineer #CS #Tech #FYI
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
