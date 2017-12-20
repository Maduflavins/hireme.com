const router = require('express').Router();
const stripe = require('stripe')('sk_test_BXLYekO6NLP4Ow4SDuJVo4i3')
const Dev = require('../models/devs')
const Order = require('../models/order');

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
        res.render('checkout/payment')
    .post((req, res, next)=>{
        var dev = req.req.session.dev;
        var price = req.session.price;
        price *= 100;
        stripe.customers.create({
            email: 'req.user.email'
        }).then(function(customer){
            return stripe.customers.createSource(customer.id, {
            source: 'req.body.stripeToken'
            });
        }).then(function(source) {
            return stripe.charges.create({
            amount: price,
            currency: 'usd',
            customer: source.customer
            });
        }).then(function(charge) {
            // Do Something
            var order = new Order();
            order.buyer = req.user._id;
            order.seller = dev.owner;
            order.dev = dev._id;
            order.save(function(err) {
                req.session.dev = null;
                req.session.price = null;
                res.redirect('/users/' + req.user._id + '/orders/' + order._id);
            })
        }).catch(function(err) {
            // Deal with an error
        });
    })
    })


    router.get('/users/:userId/order/:orderId', (req, res, next)=>{
        req.session.orderId = req.params.orderId;
        Order.findOne({ _id: req.params.orderId})
            .populate('buyer')
            .populate('seller')
            .populate('gig')
            .exec(function(err, order){
                res.render('order/order-room', { layout: 'chat_layout', order: order });
            })
    })






module.exports = router;