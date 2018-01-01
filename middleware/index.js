const Dev = require('../models/devs')
const Order = require('../models/order');
const User  = require('../models/user')
var middlewareObj = {};

middlewareObj.checkDevOwnership = function(req, res, next){

    if(req.isAuthenticated()){
        Dev.findById(req.params.id, function(err, foundDev){
            if(err){
                res.redirect("back");
            }else{
                //does user own Dev
                if(foundDev.owner.id.equals(req.user._id)){
                    next();

                }else{
                    req.flash("error", "you do not have permission for this operation");
                    res.redirect("back");
                }
                
                
            }
        });

    }else{
        req.flash("error", "Please Login or SignUp first")
        res.redirect("back");
    }
        
    
}

middlewareObj.checkOrderOwnerShip = function(req, res, next){
    if(req.isAuthenticated()){
        Order.findById(req.params.comment_id, function(err, foundOrder){
            if(err){
                req.flash("error", "order not found")
                res.redirect("back");
            }else{
                //does user own order
                if(foundOrder.user.id.equals(req.user._id)){
                    next();

                }else{
                    req.flash("error", "permission denied");
                    res.redirect("back");
                }
                
                
            }
        });

    }else{
        req.flash("error", "Please Login or SignUp first");
        res.redirect("back");
    }
            
    
}

middlewareObj.isLoggedIn = function(req, res, next){

    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error", "Please Login or SignUp first")
    res.redirect("/login")
    
}


module.exports = middlewareObj;