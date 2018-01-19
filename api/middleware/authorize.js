var Skill = require("../model/skills");
var User= require("../model/user")
var middlewareObj = {};


middlewareObj.checkSkillOwnership = function(req, res, next){
    
        if(req.isAuthenticated()){
            Skill.findById(req.params.id, function(err, foundSkill){
                if(err){
                    res.status(404).json({
                        error: err
                    });
                }else{
                
                    if(foundSkill.owner.id.equals(req.user._id)){
                        next();
    
                    }else{
                       res.status(500).json({
                           message: 'you are not authorzed'
                       })
                    }
                    
                    
                }
            });
    
        }else{
            res.status(404).json({
                message: 'you are not signedin'

            })
            
        }
    }


    module.exports = middlewareObj;