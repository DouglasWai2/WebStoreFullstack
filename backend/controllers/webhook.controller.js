const orderSchema = require("../models/order.model");
const userSchema = require("../models/user.model");
const storeSchema = require("../models/store.model");
const productSchema = require("../models/product.model");
const addressSchema = require("../models/address.model");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);
const endpointSecret = process.env.STRIPE_WHSEC;

const STRIPE_URL = "https://api.stripe.com";

exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send({ recieved: true });

  // Handle the event
  switch (event.type) {
    case "payment_intent.amount_capturable_updated":
      const paymentIntentAmountCapturableUpdated = event.data.object;
      // Then define and call a function to handle the event payment_intent.amount_capturable_updated
      break;
    case "payment_intent.canceled":
      const paymentIntentCanceled = event.data.object;
      // Then define and call a function to handle the event payment_intent.canceled
      break;
    case "payment_intent.created":
      const paymentIntentCreated = event.data.object;

      const createdOrderId = paymentIntentCreated.metadata.order_id;

      await orderSchema.findByIdAndUpdate(createdOrderId, {
        $set: { payment_intent: paymentIntentCreated.id },
      });

      break;
    case "payment_intent.partially_funded":
      const paymentIntentPartiallyFunded = event.data.object;
      // Then define and call a function to handle the event payment_intent.partially_funded
      break;
    case "payment_intent.payment_failed":
      const paymentIntentPaymentFailed = event.data.object;
      // Then define and call a function to handle the event payment_intent.payment_failed
      break;
    case "payment_intent.processing":
      const paymentIntentProcessing = event.data.object;
      const processingOrderId = paymentIntentProcessing.metadata.order_id;
      await orderSchema.findByIdAndUpdate(
        processingOrderId,
        { status: "PAYMENT_PROCESSING" },
        { new: true }
      );
      break;
    case "payment_intent.requires_action":
      const paymentIntentRequiresAction = event.data.object;
      // Then define and call a function to handle the event payment_intent.requires_action
      break;
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      try {
        const succeededOrderId = paymentIntentSucceeded.metadata.order_id;
        await orderSchema.findByIdAndUpdate(
          succeededOrderId,
          { status: "PAYMENT_APPROVED" },
          { new: true }
        );
      } catch (error) {
        console.log(error);
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};
