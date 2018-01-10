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
            bcrypt.compare(req.body.password, user[0].password, (err, result) =>{
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


exports.forgotPassword = function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({
          email: req.body.email
        }).exec(function(err, user) {
          if (user) {
            done(err, user);
          } else {
            done('User not found.');
          }
        });
      },
      function(user, done) {
        // create a random token
        crypto.randomBytes(20, function(err, buffer) {
          var token = buffer.toString('hex');
          done(err, user, token);
        });
      },
      function(user, token, done) {
        User.findByIdAndUpdate({ _id: user._id }, { resetPasswordToken: token, resetPasswordExpires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
          done(err, token, new_user);
        });
      },
      function(token, user, done) {
        var data = {
          to: user.email,
          from: email,
          subject: 'Password Reset',
          context: {
            url: 'http://hireme.com/auth/reset_password?token=' + token,
            name: user.fullName.split(' ')[0]
          }
        };
  
        smtpTransport.sendMail(data, function(err) {
          if (!err) {
            return res.json({ message: 'Kindly check your email for further instructions' });
          } else {
            return res.status(404).json({
                error: err
            });
          }
        });
      }
    ], function(err) {
      return res.status(422).json({ message: err });
    });
  };


  exports.ResetPassword = function(req, res, next) {
    User.findOne({
        resetPasswordToken: req.body.token,
        resetPasswordExpires: {
        $gt: Date.now()
      }
    }).exec(function(err, user) {
      if (!err && user) {
        if (req.body.newPassword === req.body.verifyPassword) {
          bcrypt.hash(req.body.newPassword, 10);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.save(function(err) {
            if (err) {
              return res.status(422).send({
                message: err
              });
            } else {
              var data = {
                to: user.email,
                from: email,
                template: 'reset-password-email',
                subject: 'Password Reset Confirmation',
                context: {
                  name: (user.firstname + user.lastname).split(' ')[0]
                }
              };
  
              smtpTransport.sendMail(data, function(err) {
                if (!err) {
                  return res.json({ message: 'Password reset' });
                } else {
                  return done(err);
                }
              });
            }
          });
        } else {
          return res.status(422).send({
            message: 'Passwords do not match'
          });
        }
      } else {
        return res.status(400).send({
          message: 'Password reset token is invalid or has expired.'
        });
      }
    });
  };
  

exports.DeleteUser = (req, res, next)=>{
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result=>{
            res.status(200).json({
            message: 'User deleted'
            
        });
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
};

exports.EditUserProfile = (req, res, next)=>{
    User.find({ email: req.body.email})
        .exec()
        .then(user=>{
            if(user.length < 1){
                return res.status(400).json({
                    message: 'user not found'
                })
            }
            var firstname = req.body.firstname;
            var lastname=  req.body.lastname;
            var phonenumber =  request.body.phonenumber;
            var profilePicture =  req.file.path;

        })
        user
        .save()
        .then(user, done=>{
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
                subject: 'Profile Update',
                text: 'you are receiving this email because you or someone has updated your profile. \n\n' +
                'You can now go back to the website, login to continue using your account. Than You.'
            };
            smtpTransport.sendMail(mailOptions, function(err){
                done(err, 'done');
                res.status(200).json({
                    message: 'An email has been sent to' + user.email + 'with further instructions.',
                    url: '/forgot'
                });
            })

            
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}