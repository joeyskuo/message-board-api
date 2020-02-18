const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');

const boardController = require('../controllers/board');

const router = express.Router();

router.get('/posts', boardController.getPosts);
router.get('/post/:postId', boardController.getPost);
router.post('/post', 
        [
            body('title').trim().isLength({min: 5}),
            body('content').trim().isLength({min: 5})
        ], 
        boardController.createPost);
router.put('/post/:postId', 
        [
            body('title').trim().isLength({min: 5}),
            body('content').trim().isLength({min: 5})
        ],
        auth, 
        boardController.updatePost);

module.exports = router;