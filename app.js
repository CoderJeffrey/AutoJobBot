const express = require('express');
const app = express();
const postRoutes = require('./routes/publishPostRoute');
const generalRoutes = require('./routes/generalRoute');
const cron = require('node-cron');
const { publishPosts } = require('./controllers/publishPostController');

app.use(express.json());
app.use('/', generalRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`LinkedIn Bot is running on http://localhost:${PORT}`);
});

// make a daily post by calling the publishPost function from controller
// at 11:20 PM every day (Los Angeles time)

// read the hour and minute from the config file
const dailyPostHour = process.env.DAILY_POST_HOUR;
const dailyPostMinute = process.env.DAILY_POST_MINUTE;

// cron schedule to make a post every 3 hours
let cron_schedule_3_hours = '0 */3 * * *';
let cron_schedule_daily  = `${dailyPostMinute} ${dailyPostHour} * * *`;

(async () => {
    // Run the function immediately
    console.log('Making an immediate post at:', new Date().toISOString());
    try {
        await publishPosts();
    } catch (error) {
        console.error("Error publishing immediate post:", error);
    }

    // Schedule the cron job to run every 3 hours
    cron.schedule(cron_schedule_3_hours, async () => {
        // Print out current exact time
        console.log('Making a scheduled post at:', new Date().toISOString());
        try {
            await publishPosts();
        } catch (error) {
            console.error("Error publishing scheduled post:", error);
        }
    }, {
        timezone: "America/Los_Angeles"
    });
})();
