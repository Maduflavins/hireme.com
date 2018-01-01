const router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../config/passport');
const User = require('../models/user');
const multer = require('multer');

const storage = multer.diskStorage({
    destinaton: function(req, file, cb){
        cb(null, './userUploads');

    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);

    }
})
const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}
const upload = multer({storage: storage, limits: {
  fileSize: 1024 * 1024 * 5
},
fileFilter: fileFilter
});


/* SIGNUP ROUTE */
router.route('/signup')

  .get((req, res, next) => {
    res.render('accounts/signup', { message: req.flash('errors')});
  })

  .post((req, res, next) => {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        req.flash('errors',  'Account with that email address already exists.');
        return res.redirect('/signup');
      } else {
        var user = new User();
        user.name = req.body.username;
        user.email = req.body.email;
        user.photo = req.file.path;
        user.password = req.body.password;
        user.save(function(err) {
          if (err) return next(err);
          req.logIn(user, function(err) {
            if (err) return next(err);
            res.status(200).json({
              message: 'Successfully added a user',
              createdUser:{
                name: 'user.name',
                email: 'user.email',
                photo: 'req.file.path',
                password: 'user.password'
              }
            });
          });
        });
      }
    });
  });


/* LOGIN ROUTE */
router.route('/login')

  .get((req, res, next) => {
    if (req.user) return res.redirect('/');
    res.status(500).json({
      message: 'please sign in with corrrect credentials',
      signinCredentials:{
        email: 'user.email',
        password: 'user.password'
      }
    })
  })

  .post(passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

/* PROFILE ROUTE */
router.get('/profile', passportConfig.isAuthenticated, (req, res, next) => {
  res.render('accounts/profile');
});


router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
