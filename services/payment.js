import express from "express";
const paymentRouter = express.Router();

paymentRouter.use(express.json());

const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

const calculateOrderAmount = (items) => {
  return 1400;
};

paymentRouter.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

export { paymentRouter };
