const express = require('express');
const bodyParser = require('body-parser');

const boardRoutes = require('./routes/board');

const app = express();

// Middleware
app.use(bodyParser.json()); 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/board', boardRoutes);

app.listen(8080);