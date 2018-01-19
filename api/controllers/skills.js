const User = require('../model/skills');
const crypto = require('crypto');
const passport = require('passport');
const nodemailer = require('nodemailer');
const sync = require('async');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const localMongoose = require('passport-local-mongoose');


exports.getSkills = (req, res, next)=>{
    Skill.find()
     .select('title skillImage stateofoperation _id')
     .exec()
     .then(docs =>{
         const response = {
             count: docs.length,
             skills: docs.map(doc =>{
                 return {
                     title: doc.title,
                     skillImage: doc.skillImage,
                     stateofoperation: doc.stateofoperation,
                     id: doc_id,
                     request: {
                         type: 'GET',
                         url: 'http://www.hireme.com/skills' + doc_id
                     }
                 }
             })
         }
         res.status(200).json(response);
     })
     .catch(err =>{
         console.log(err);
         res.status(500).json({
             error: err
         })
     })
 };

 exports.createSkills = (req, res, next)=>{
    const skill = new Skill ({
        owner: {
            id: req.user._id,
            name: req.user.firstname + req.user.lastname
        },
        title:req.body.title,
        about: req.body.about,
        stateofoperation: req.body.state,
        localgovernment: req.body.localgovernment,
        phonenumber: req.body.phoneNumber,
        nearestlandmark: req.body.nearestlandmark,
        email: req.body.email,
        skillImage: req.file.path

    })
    skill
        .save()
        .then(result=>{
            console.log(result);
            res.status(200).json({
                message: 'this is the post request to skills',
                createdSkill: {
                    title: result.title,
                    about: result.about,
                    stateofoperation: result.stateofoperation,
                    localgovernment: result.localgovernment,
                    nearestlandmark: result.nearestlandmark,
                    email: result.email,
                    owner: result.owner.name,
                    phonenumber: result.phonenumber,
                    _id: result.owner._id,
                    request: {
                        type: 'GET',
                        url: "http://www.hireme.com/skills" + result._id
                    }
                }
            })
        })
        .catch(err => console.log(err));
        res.status(500).json({
            error: err
        })
   
};

exports.getSpecificSkill = (req, res, next)=>{
    const id = req.params._id;
    Skill.findById(id)
        .select('title about stateofoperation localgovernment nearestlandmark email owner id picture skillImage')
        .exec()
        .then(doc =>{
            console.log("from database", doc);
            if(doc){
                res.status(200).json({
                    skill: doc,
                    request: {
                        type: 'GET',
                        description: 'get all skills',
                        url:"http://www.hireme.com/skills" 
                    }
                });
            }else{
                res.status(404).json({
                    message: 'the required skill is not found'
                })
            }
           
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err});
        })
};

exports.updateSkill = (req, res, next)=>{
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
   Skill.update({ _id: reqs.params.id}, {$set: updateOps })
    .exec()
    .then(result=>{
        console.log(result)
        res.status(200).json({
            message: 'skill updated',
            request:{
                type: 'GET',
                description: 'Get_All_Skills',
                url: 'http://www.hireme.com/skills' + id
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        })
    })
};


exports.deleteSkills = (req, res, next)=>{
    Skill.remove({_id: req.params.id})
        .exec()
        .then(result =>{
            res.status(200).json({
                message: 'skill deleted',
                request: {
                    type: 'POST',
                    url: 'http://www.hireme.com/skills',
                    body:{
                        title: String,
                        about: String,
                        stateofoperation: String,
                        localgovernment: String,
                        nearestlandmark: String,
                        phonenumber: Number,
                        email: String,
                        owner: {
                            type: Schema.Types.ObjectId, 
                            ref: 'User'
                        }

                    }
                }
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};