const router = require('express').Router();
const Dev = require('../models/devs')

const fee = 5.00;


router.get('/checkout/single_package/:id', (req, res, next)=>{
    Dev.findOne({ _id: req.params.id }, function(err, dev) {
        var totalPrice = dev.price + fee;
        req.session.dev = dev;
        req.session.price = totalPrice;
        res.render('checkout/single_package', { dev: dev, totalPrice: totalPrice})
    })
});

router.route('/payment')
    .get((req, res, next)=>{
        res.render('checkout/payment');
    })






module.exports = router;