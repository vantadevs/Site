# NOVEX MARKET

A Next.js 15 + Supabase + Stripe digital-products storefront. The supplied Novex wide banner is used as the homepage hero. A standalone square logo was not present in the available project assets, so the navigation currently uses a clean typographic `N` mark; replace it with the official square logo when supplied.

## What's included
- Responsive navy/cyan storefront, category pages, product detail pages, catalogue search/filter, persistent local cart.
- Supabase email/password authentication, customer order history, password reset, support form.
- Stripe-hosted Checkout in test mode, signed webhook verification, server-side product/price lookup.
- SQL migration with categories, products, orders, order items, discount codes, licence-key inventory, fulfilment, reviews, support tickets, indexes and RLS.
- Admin area protected by the `profiles.is_admin` database flag, product publishing, order status updates and basic sales overview.

## Stage 1 — local setup
1. Install Node.js 20+ and run `npm install`.
2. Copy `.env.example` to `.env.local` and fill in the Supabase project URL and anon key. Keep service-role and Stripe secrets server-only.
3. In Supabase SQL Editor, run `supabase/migrations/0001_initial.sql`.
4. In Supabase Authentication settings, enable email/password and configure your local and production redirect URLs.
5. Run `npm run dev` and open `http://localhost:3000`.

## Stage 2 — administrator setup
1. Create a user through `/account` and confirm the email.
2. In Supabase SQL Editor, set the admin flag for that exact user UUID:
   ```sql
   update public.profiles set is_admin = true where id = 'YOUR_AUTH_USER_UUID';
   ```
3. Visit `/admin`. Admin access is checked against the authenticated user's `profiles.is_admin` field and RLS policies.
4. Add categories and products; set `is_active=true` to publish. Add featured products by setting `is_featured=true`.

## Stage 3 — Stripe test checkout
1. Create a Stripe account and use test-mode API keys.
2. Set `STRIPE_SECRET_KEY=sk_test_...` and `NEXT_PUBLIC_SITE_URL`.
3. Add a webhook endpoint pointing to `https://YOUR_DOMAIN/api/webhook` (for local development use Stripe CLI forwarding to `localhost:3000/api/webhook`). Subscribe to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.expired`.
4. Set `STRIPE_WEBHOOK_SECRET=whsec_...` from the endpoint/CLI.
5. Test using Stripe test card `4242 4242 4242 4242`, any future expiry and any CVC. Never switch to live mode until all acceptance checks pass.

## Digital key inventory
Licence keys are stored in `digital_keys.key_ciphertext`, which is inaccessible to ordinary customers by RLS. Populate inventory only from a trusted server-side/admin process. The `complete_paid_order` security-definer RPC is executable only by `service_role`; it allocates available keys under row locks after the signed Stripe webhook confirms `payment_status=paid`. Customers can read only `digital_deliveries` belonging to their own order. **Important:** the starter currently stores the delivered value in the database as supplied; `key_ciphertext` is only a column name and is not encryption. Before production, encrypt key values at rest with a managed KMS or application-level envelope encryption and decrypt only for the owning customer.

## Important production hardening still required
- Discount codes are validated server-side and applied using a Stripe one-time coupon. Usage counts increment only after the verified payment webhook. Add an atomic reservation system before enabling strict one-time/limited-use campaigns at scale, since multiple pending checkouts can temporarily race for the last use.
- Add stock reservation/decrement logic with an atomic database function before accepting limited-stock inventory at scale. Current checkout checks stock but does not reserve it.
- Configure Supabase Storage buckets and upload policies for product imagery; current admin image field accepts a URL.
- Add admin key-import UI, customer management UI, richer order fulfilment controls, product editing/deletion, category editing, discount-code management UI, and review moderation workflows. Never paste licence keys into client-side code.
- Add rate limiting / CAPTCHA to public support and checkout endpoints, email notifications, privacy/terms/refund policies, tax/VAT configuration and operational monitoring.
- Verify that the payment, refund, fulfilment, email, and account recovery flows work in your own Supabase/Stripe projects before launch.

## Acceptance test checklist
- [ ] Sign up, confirm email, sign in, sign out, reset password.
- [ ] Publish a product; verify it appears in shop and category pages.
- [ ] Search/filter catalogue; add item; refresh; confirm cart persists; update quantity/remove.
- [ ] Start Stripe test checkout; confirm pending order exists; complete test payment.
- [ ] Confirm webhook signature validation and order state transition to `paid`.
- [ ] Add test keys; verify only one key is allocated per purchased unit and the customer sees only their own delivery.
- [ ] Confirm manual fulfilment products do not expose keys.
- [ ] Confirm customer A cannot read customer B's orders or deliveries.
- [ ] Confirm non-admin users cannot access `/admin` or mutate products/orders.
- [ ] Test support form, mobile nav, tablet and desktop layouts.

## Deployment
Deploy to Vercel or another Node-compatible host. Add all environment variables in the hosting dashboard. Set the Stripe webhook to the production `/api/webhook` URL. Run the migration against the production Supabase project. Keep `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` private.

## Scope notes for this first build pass
This is a deployable application foundation, not a claim that a live production store is already operating. No Stripe/Supabase credentials were supplied, so payment processing, email authentication, database queries and webhook delivery cannot be exercised against your accounts yet. Product catalogue starts empty by design; no fictional products, reviews, sales counts or customer records are seeded. The separate square Novex icon was not present in the accessible assets, so the header uses a temporary typographic N mark until that exact image is supplied.
