// writePostContent.js
function writePostContent(jobPost) {
    let isSponsored = jobPost.sponsorship;
    const postContent = `
${jobPost.company} just released its ${jobPost.jobTitle} now 🚀
${isSponsored ? '🛂 Visa Sponsorship Available' : '🚫 Visa Sponsorship Not Available'} 
Link Below to Apply 👇️

Application Link: ${jobPost.jobLink}  
➡️ Follow for more updates like this!
↘️ Drop your email below and I will send you Resume Templates that get me into Amazon, LinkedIn and Google! 🚀️
⬇️ Or I get lazy and forget to send 😂️
#JobAlert #${jobPost.company} #Internship #NewGrad
`;

    return postContent;
}

module.exports = { writePostContent};
