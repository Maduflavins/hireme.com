const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const crypto = require('crypto');
const passport = require('passport');
const UserController = require('../controllers/users');
const nodemailer = require('nodemailer');
const sync = require('async');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './profilePictureUploads/')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, res, cb)=>{
    if(file.mimetype = 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
        res.status(409).json({
            message: 'image type is not supported'
        })
    }
}
const upload = multer({
    storage: storage,
    limit:{
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: fileFilter
});



router.post("/signup", upload.single('profilePicture'),  UserController.UserSignup)

router.post('/login', UserController.UserSign)

router.post('/forgot-password', UserController.forgotPassword)

router.post('/reset-password', UserController.ResetPassword)
router.post('/update-profile/:userId', UserController.EditUserProfile )

router.delete('/:userId', UserController.DeleteUser)


module.exports = router;
