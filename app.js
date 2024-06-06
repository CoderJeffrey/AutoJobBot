const express = require('express');
const app = express();
const postRoutes = require('./routes/publishPostRoute');

app.use(express.json());
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`LinkedIn Bot is running on http://localhost:${PORT}`);
});