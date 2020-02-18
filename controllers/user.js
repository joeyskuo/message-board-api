const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.signup = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    bcrypt
        .hash(password, 12)
        .then(hash => {
            const user = new User({
                email: email,
                password: hash,
                username: username
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({message: 'User created!'});
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}