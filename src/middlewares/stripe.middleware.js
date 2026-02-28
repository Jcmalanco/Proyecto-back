const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware para validar la firma de los webhooks de Stripe (si se necesita en el futuro)
/* function stripeWebhookMiddleware(req, res, next) {
  const sig = req.headers['stripe-signature'];
} */

module.exports = {stripe, /* stripeWebhookMiddleware */};