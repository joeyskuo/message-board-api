const express = require('express');

const boardController = require('../controllers/board');

const router = express.Router();

router.get('/posts', boardController.getPosts);
router.post('/post', boardController.createPost);

module.exports = router;