const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const db = require('./private/credentials');

const boardRoutes = require('./routes/board');
const userRoutes = require('./routes/user');


const app = express();

const fileStorage = multer.diskStorage( {
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// Middleware
app.use(bodyParser.json()); 
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Routes
app.use('/board', boardRoutes);
app.use('/u', userRoutes);

// Error
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message;

    console.log(error);
    res.status(statusCode).json({message});
})

mongoose.connect(
    `mongodb+srv://${db.USERNAME}:${db.PASSWORD}@message-board-dev-pzljn.mongodb.net/test?retryWrites=true&w=majority`
    ).then(res => {
        app.listen(8080);
    }).catch(err => {
        console.log(err);
    });