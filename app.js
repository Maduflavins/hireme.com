const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const sync = require('async');

const userRoutes = require('./api/routes/user');


mongoose.connect('mongodb://hireadev:imaginedragons@ds141796.mlab.com:41796/hireadev')

app.use(morgan('dev'));
app.use('/profilePictureUploads', express.static('profilePictureUploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Rquesteds-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT')
        return res.status(200).json();
    }
    next();
})

// Routes 
app.use('/user', userRoutes);

app.use((req, res, next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

module.exports = app;