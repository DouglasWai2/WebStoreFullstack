const express = require("express");
const router = express.Router();
require('dotenv').config()
const UserSchema = require('../models/user.model')
const auth = require('../middlewares/verifyToken')
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY)

const BASE_URL = "https://api.stripe.com"


router.get('/test/payment/:access_token', auth, async (req, res) => {

  const user = await UserSchema.findById(req.userInfo.id)

  const setupIntent = await stripe.setupIntents.create({
    customer: user.customerId,
    payment_method_types: [ 'card'],
  });


  res.status(200).json({client_secret: setupIntent.client_secret});
  

  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ['card'],
  //   mode: 'setup',
  //   customer: '{{CUSTOMER_ID}}',
  //   success_url: 'http//localhost:5000/success?session_id={CHECKOUT_SESSION_ID}',
  //   cancel_url: 'https://localhost:5000/cancel',
  // });
    // const paymentIntent = await stripe.paymentIntents.create({
    //     amount: 1099,
    //     currency: 'brl',
    //     automatic_payment_methods: {
    //       enabled: true,
    //     },
    //   });
    //   res.status(200).send({client_secret: paymentIntent.client_secret})
})

module.exports = router

