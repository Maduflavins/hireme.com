const User = require('../model/user');
const crypto = require('crypto');
const passport = require('passport');
const nodemailer = require('nodemailer');
const sync = require('async');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const localMongoose = require('passport-local-mongoose');

exports.UserSignup = (req, res, next)=>{
    User.find({ email: req.body.email })
        .exec()
        .then(user =>{
            if(user.length >= 1){
                return res.status(409).json({
                    message: 'Email already exist'
                })
            }
            else{

                bcrypt.hash(req.body.password, 10, (err, hash)=>{
                    if(err){
                        return res.status(500).json({
                            error: err
                        })
                    }else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            phonenumber: request.body.phonenumber,
                            email: req.body.email,
                            password: hash,
                            profilePicture: req.file.path
                        })
                        user
                        .save()
                        .then(result=>{
                            console.log(result);
                            res.status(200).json({
                                message: 'User successfully created'
                            })
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                    }
                })

            }
        })
    
    
};

exports. UserSign = (req, res, next)=>{
    User.find({ email: req.body.email })
        .exec()
        .then(user=>{
            if(user.length < 1){
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].passwprd, (err, result) =>{
                if(err){
                    return res.status(401).json({
                        message: 'Authentication failed'
                    })
                }
                if(result){
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    )
                    return res.status(200).json({
                        message: 'Auhentication successful',
                        token : token
                    })
                }
                res.status(401).json({
                    message: 'Authentication failed'
                })
            })
        })
        .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
};


exports. forgetPassword = (req, res,next)=>{
    async.waterfall([
        function(done){
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString('hex');
                done(err, token)
            });

        },
        function(token, done){
            User.findOne({ email: req.body.email}, (err, user)=>{
                if(!user){
                    res.status(404).json({
                        message: 'No such password exist',
                        url: '/api/forgot'
                    })
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; //1 hour

                user.save((err)=>{
                    done(err, token, user)
                })
            })

        },
        function(token, user, done){
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'hireme@gmail.com',
                    pass: process.env.GMAIL_PW
                }
            
            })
            var mailOptions = {
                to: user.email,
                from: 'hireme@gmail.com',
                subject: 'Password Reset',
                text: 'you are receiving this email because you or someone has requested the reset of the password for your account. \n\n' +
                'please click on the following link, or paste this into your browser to complete the process:\n\n' + 
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'if you did not request this, please ignore this mail'
            };
            smtpTransport.sendMail(mailOptions, function(err){
                done(err, 'done');
                res.status(200).json({
                    message: 'An email has been sent to' + user.email + 'with further instructions.',
                    url: '/forgot'
                });
            })
        }
    ])

};

exports.getResetToken = (req, res)=>{
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires:{$gt: Date.now() } }, (err, user)=>{
        if(!user){
            res.status(404).json({
                mesage: 'password reset token is invalid or has expired',
                url: '/api/forgot'
            })
        }
        res.status(200).json({
            token: req.params.token
        })
    })
};

exports.PostResetToken = function(req, res){
    sync.waterfall([
        function(done){
            User.findOne({ resetPassword: req.params.token, resetPasswordExpires: { $gt: date.now()}}, function(err, user){
                if(!user){
                    res.status(404).json({
                        message: 'password reset token invalid or has expired',
                        url: '/api/reset/:token'
                    })
                }
                if(req.body.password === req.body.confirm){
                    user.setPassword(req.body.password, function(err){
                        user.resetPasswordToen = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function(err){
                            req.logIn(user, function(err){
                                done(err, user);
                                res.status(200).json({
                                    message: 'success'
                                })
                            })
                        })
                    })
                } else{
                    res.status(409).json({
                        message: 'password could not be saved',
                        url: '/api/reset/:token'
                    })
                }
            })

        },
        function(user, done){
            var smtpTransport = nosemailer.createTransport({
                service: 'Gmail',
                auth:{
                    user: 'hiremeinfo@gmail.com',
                    pass: process.env.GMAIL_PW
                }
            });
            var mailOptions = {
                to: user.email,
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'this is a confirmation that the password for your email account' + user.email + 'has been changed successfully. \n'
            };
            smtpTransport.sendMail(mailOptions,(err,res)=>{
                done(err)
            })

        }
    ], function(err){
        res.status(200).json({
            message: 'successfully changed your password',
            url: '/'
        })
    })
};

exports.DeleteUser = (req, res, next)=>{
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result=>{
            res.status(200).json({
            message: 'User deleted'
            
        });
    })
    .catc(err=>{
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
};