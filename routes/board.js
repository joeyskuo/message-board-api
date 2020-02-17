const express = require('express');
const { body } = require('express-validator/check');

const boardController = require('../controllers/board');

const router = express.Router();

router.get('/posts', boardController.getPosts);
router.post('/post', [
            body('title').trim().isLength({min: 5}),
            body('content').trim().isLength({min: 5})
        ], 
        boardController.createPost);

module.exports = router;