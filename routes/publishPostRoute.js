const express = require('express');
const router = express.Router();
const postController = require('../controllers/publishPostController');

router.get('/post', postController.publishPost);

module.exports = router;