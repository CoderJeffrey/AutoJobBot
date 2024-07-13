const supabaseService = require('@supabase/supabase-js');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

let supabaseClient = null;

const connectToSupabase = async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    supabaseClient = supabaseService.createClient(supabaseUrl, supabaseKey);
}

(async () => {
    await connectToSupabase();
})();

const uploadCompanyPosting = async (jobPost) => {
    // let jobPost = {
    //     company: company,
    //     jobTitle: jobTitle,
    //     jobLocation: jobLocation,
    //     postDate: postDateObj,
    //     jobLink: joblink
    // };
    const { data, error } = await supabaseClient
        .from('Company')
        .insert([
            {
                company_name: jobPost.company,
                date_posted: jobPost.postDate,
                role: jobPost.jobTitle,
                location: jobPost.jobLocation,
                application_link: jobPost.jobLink
            }
        ])
        .select();

    if (error) {
        // print the error
        console.error("database Error is:", error);
    } else {
        console.log("data is:", data);
    }

    return data;
}


const connectToSupabaseAndPostJob = async (jobPost) => {
    let postResult = null;
    try {
        postResult = await uploadCompanyPosting(jobPost);
    } catch (error) {
        console.error("connectToSupabaseAndPostJob error is:", error);
    }
    return postResult;
}

const readJobPostings = async () => {
    try {
        let { data: allJobs, error } = await supabaseClient
            .from('Company')
            .select('*');

        if (error) {
            console.error("Error in reading job postings from the database");
        } else {
            console.log("allJobs is:", allJobs);
        }

        return allJobs;
    } catch (error) {
        console.error("readJobPostings error is:", error);
    }
}

const connectToSupabaseAndGetJobs= async () => {
    try {
        const allJobs = await readJobPostings();
        return allJobs;
    } catch (error) {
        console.error("connectToSupabaseAndGetJobs error is:", error);
        return null;
    }
}

// connectToSupabaseAndGetJobs();
// sample job post
// let sampleJobPost = {
//     company: "GPTZero",
//     postDate: new Date(2024,7,2),
//     jobTitle: "Software Engineer",
//     jobLocation: "Mountain View, CA",
//     jobLink: "test.com"
// };
//
// connectToSupabaseAndPostJob(sampleJobPost);

module.exports = {
    connectToSupabaseAndPostJob,
    connectToSupabaseAndGetJobs
}

