// const router = require("express").Router();
// const stripe = require("stripe")(process.env.STRIPE_KEY)

// router.post("/payment" , (req , res)=>{
//     stripe.charges.create({
//         sorce : req.body.tokenId,
//         amount : req.body.amount,
//         currency : "usd"
//     }, 
//     (stripeErr , stripeRes)=>{
//         if(stripeErr){
//             res.status(500).json(stripeErr)
//         }
//         else{
//             res.status(200).json(stripeRes)
//         }
//     })
// })
// module.exports = router


const router = require("express").Router();
// const stripe = require("stripe")(process.env.STRIPE_KEY);
const KEY = process.env.STRIPE_KEY
const stripe = require("stripe")("sk_test_51LKc43SJstE3ZNVN1qUjmXNFy1ieonJnEQV4r8JZcZIhBu9IU8K7CweoKSEmwvuPOumeeWdgQxI06cWYq1YDGlj700YkcQHgd9");

router.post("/payment", async (req, res) => {
    await stripe.paymentIntents.create(
    {
    //   source: req.body.tokenId,
      amount: req.body.amount,
      currency: "inr",
      payment_method_types: ['card']
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;