const router = require('express').Router();
const async = require('async');
const Dev = require('../models/devs');
const User = require('../models/user');



router.get('/', (req, res, next) => {
    Dev.find({}, function(err, devs){
        res.render('main/home', { devs: devs });
    });
});

router.get('/my-devs', (req, res, next) =>{
    Dev.find({ owner: req.user._id }, function(err, devs){
        res.render('main/my-devs', { devs: devs });
    })
});

router.route('/add-new-dev')
    .get((req, res, next)=>{
        res.render('main/add-new-dev');
    })
    .post((req, res, next)=>{
        async.waterfall([
            function(callback){
                var dev = new Dev();
                dev.owner = req.user._id;
                dev.title = req.body.dev_title;
                dev.category = req.body.dev_category;
                dev.about = req.body.dev_about;
                dev.price = req.body.dev_price;
                dev.state = req.body.dev_state;
                dev.region = req.body.dev_region;
                dev.busstop = req.body.dev_busstop;
                dev.save(function(err){
                    callback(err, dev);
                })

            },
            function(dev, callback){
                User.update(
                    {
                        _id: req.user._id
                    },{
                        $push:{ devs: dev._id }
                    }, function(err, count) {
                        res.redirect('/my-devs');
                    }
                )
                
            }
        ])
    })

module.exports = router;
