const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const userController = require('../controllers/user');

const router = express.Router();

router.put('/signup', 
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User
                        .findOne({email: value})
                        .then(userDoc => {
                            if(userDoc) return Promise.reject('E-mail address already exists!');
                        })
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({min: 5}),
        body('username')
            .trim()
            .not()
            .isEmpty()

    ],
    userController.signup
);

module.exports = router;