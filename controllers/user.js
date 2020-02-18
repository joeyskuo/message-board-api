const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let validUser;

    User
        .findOne({email})
        .then(user => {
            if(!user) {
                const error = new Error('User with this email not found.');
                error.statusCode = 401;
                throw error;
            }

            validUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if(!isEqual) {
                const error = new Error('Incorrect Password.');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: email, 
                userId: validUser._id.toString()
            }, 
            'secret',
            { expiresIn: '1h'}
            );
            res.status(200).json({token: token, userId: validUser._id.toString()});
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}