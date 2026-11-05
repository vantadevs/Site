import Stripe from 'stripe';
export function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Stripe is not configured. Add STRIPE_SECRET_KEY on the server.');
  return new Stripe(key);
}
