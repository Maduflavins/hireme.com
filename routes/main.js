const router = require('express').Router();
const async = require('async');
const Dev = require('../models/devs');
const User = require('../models/user');
const multer = require('multer');

const storage = multer.diskStorage({
    destinaton: function(req, file, cb){
        cb(null, './devsUploads');

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
    fileSize: 1024 * 1024 * 6
},
fileFilter: fileFilter
});

const middleware = require("../middleware/index.js");





router.get('/', (req, res, next) => {
    Dev.find({})
        .select('name owner state _id picture')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                devs: docs.map(doc =>{
                    return{
                        name: doc.name,
                        owner: doc.owner,
                        state: doc.state,
                        picture: doc.picture,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/devs/'+ doc._id
                        }
                    }
                })
            }
            console.log(docs);
            if(docs.length >= 0){
                res.status(200).json(response);
            }else{
                res.status(404).json({
                    message: 'No Devs registered yet'
                })
            }
            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});




router.get('/my-devs', (req, res, next) =>{
    Dev.find({ owner: req.user._id })
    .exec()
    .then(docs =>{
        console.logs(docs)
        res.status(200).json(docs);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

router.route('/add-new-dev', middleware.isLoggedIn, upload.single('devPicture'))
    .get((req, res, next)=>{
        res.status(200).json({
            message: 'Getting form to add new dev'
        });
    })
    .post((req, res, next,)=>{
        console.log(req.file)
        
        async.waterfall([
            function(callback){
                var dev = new Dev({
                    owner: req.user._id,
                    title: req.body.dev_title,
                    category: req.body.dev_category,
                    about: req.body.dev_about,
                    state: req.body.dev_state,
                    region: req.body.dev_region,
                    busstop: req.body.dev_busstop,
                    picture: req.file.path

                });
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
                        res.status(201).json({
                            message: 'Success in adding new dev',
                            createdDev: {
                                title: dev.title,
                                state: dev.state,
                                region: dev.region,
                                busstop: dev.busstop,
                                _id: dev._id,
                                request: {
                                    type:'GET',
                                    url: 'http://localhost:3000/devs/' + dev._id
                                }

                            }
                        })
                    }
                )
                
            }
        ])
    });

    router.get('/service_detail/:id', middleware.isLoggedIn, (req, res, next)=>{
        Dev.findOne({ _id: req.params.id })
            .select('owner titlestate regin _id picture')
            .populate('owner')
            .exec()
            .then(doc=>{
                console.log(doc);
                if(doc){
                    res.status(200).json({
                        dev: doc,
                        request: {
                            type: 'Get',
                            description: 'Get a particular Dev',
                            url: 'http://localhost:300/devs/:id'
                        }
                    });
                }else{
                    res.status(404).json({
                        message: 'The Item is not found'
                    })
                }
               
            })
    })
    //*** The codes below are throwing unneccessary errors willtry to fix them later */

    // router.patch('/service/:id', middleware.CheckDevOwnerShip, (req, res, next)=>{
    //     const id = req.params.devId;
    //     const updateOps = {};
    //     for (const ops of req.body){
    //         updateOps[ops.propName] = ops.value;
    //     }
    //     Dev.update({_id: id}, {$set:updateOps })
    //         .exec()
    //         .then(result =>{
     
    //             res.status(200).json({

    //                  message: 'Dev Updated successfully',
    //                  request:{
    //                        type: 'Get',
    //                        url: 'http://localhost:3000/devs/' + id
    //                  }
    //            })
    //         })
    //         .catch(err =>{
    //             console.log(err);
    //             res.status(500).json({
    //                 error: err
    //             })
    //         })

    // })

    // router.delete('/service/:id', middleware.CheckDevOwnerShip, (req, res, next)=>{
    //     Dev.findByIdAndRemove(req.params.id)
    //     .exec()
    //     .then(result =>{
    //         res.status(200).json({
    //              message: 'Dev Deleted Successfully',
    //              request:{
    //                  type: 'POST',
    //                  description: 'Craete a New Dev'
    //                  url: 'http://localhost:300/devs/'
    //                  body: { title: 'String',category: 'String', state:'String', region: 'String', busstop:'String' }
    //              }
    //         });
    //     })
    //     .catch(err =>{
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         })
    //     })
        
    // })
//************************************************************************************************** */
module.exports = router;
