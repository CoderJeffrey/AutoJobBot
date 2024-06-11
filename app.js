const express = require('express');
const app = express();
const postRoutes = require('./routes/publishPostRoute');
const cron = require('node-cron');
const { publishPost } = require('./controllers/publishPostController');

app.use(express.json());
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`LinkedIn Bot is running on http://localhost:${PORT}`);
});

// make a daily post by calling the publishPost function from controller
// at 11:20 PM every day (Los Angeles time)
cron.schedule('00 23 * * *', async () => {
    // Print out current exact time
    console.log('Making a daily post at:', new Date().toISOString());
    try {
        await publishPost();
    } catch (error) {
        console.error("Error publishing post:", error);
    }
}, {
    timezone: "America/Los_Angeles"
});
