const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Welcome to Server of Tech Buddy");
});

module.exports = router;