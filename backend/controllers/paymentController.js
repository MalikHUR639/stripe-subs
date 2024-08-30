import User from "../models/userModel.js";
import stripe from "../utils/stripe.js";
import asyncHandler from "express-async-handler";

const getPrice = asyncHandler(async (req, res) => {
  
  try {
    const { priceId } = req.body;
    const priceData = await stripe.prices.retrieve(priceId);
    const { id , nickname , unit_amount } = priceData;
    res.json({ id , nickname , unit_amount });
  } catch (error) {
    console.log('error', error)
    res.status(400).json({ error: { message: "No such price" } });
  }
});

const subscriptionUpdate = asyncHandler(async (req, res) => {
  const { isSubscriber, userId } = req.body;
  const user = await User.findById(userId).select('-password');

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.isSubscriber = isSubscriber;
  user.updatedAt = new Date();

  await user.save();

  res
    .status(200)
    .json({ message: "Subscription status updated successfully", isSubscriber: isSubscriber });
});

const createSubscription = asyncHandler(async (req, res) => {
  const { priceId, customerID } = req.body;
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerID ?? "",
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: { customerID },
    });


    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }
});

const cancelSubscription = asyncHandler(async (req, res) => {
  try {
    const { customerID } = req.body;

    const response = await stripe.subscriptions.search({
      query: `status:'active' AND metadata['customerID']:'${customerID}'`,
    });
    const subscriptionID = response?.data[0]?.id;

    if (subscriptionID) {
      await stripe.subscriptions.cancel(subscriptionID);
      const user = await User.findOne({ customerID }).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.isSubscriber = false;
      user.updatedAt = new Date();

      await user.save();

      res.status(200).json({
        message: "Subscription cancelled successfully",
        isSubscriber: false,
      });
    } else {
      res.json({ status: "No active subscription" });
    }
  } catch (error) {
    console.error("Error retrieving subscription info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const webhook = asyncHandler(async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_END_POINT_KEY
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "invoice.payment_succeeded":
      const invoicePaymentSucceeded = event.data.object;
      console.log("heeelo >>", invoicePaymentSucceeded);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
});

export { webhook, cancelSubscription, createSubscription ,getPrice,subscriptionUpdate};
