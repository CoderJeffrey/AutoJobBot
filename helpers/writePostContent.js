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
📢 ${jobPost.company} Just released its ${jobPost.jobTitle} role 📢

You Can't Miss Out on This Must-Apply Internship/Job Opportunity!

Something to know about
1. The role is based in ${jobPost.jobLocation}.
2. The role was posted on ${postMonth}/${postDay}/${postYear}.
2. The position is usually filled within 48 hours, so apply NOW! NOW! NOW!

Here's the link: ${jobPost.jobLink}

FYI: Some Internship closes within 2 hours 🚨, so apply early & follow me for most up-to-date internship/job 💼 opportunities.

#Internship #JobOpportunity #JobSearch #ComputerScience #SoftwareEngineer #CS #Tech
    `;

    return postContent;
}


module.exports = { writePostContent };
