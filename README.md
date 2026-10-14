# Teks Tech Platform

## Stage 1: foundation
Dependencies, env template, full database schema.

## Setup
1. `cp .env.example .env` and fill in values
2. `npm install`

4. `npm run dev`

## Next stages
2. (written, untested) Auth API, middleware, design tokens, public homepage

4. Customer dashboard + Paystack initialize/verify + webhook
5. Admin dashboard, analytics, sitemap/SEO
3. (written, untested) Login/register pages, invitation builder, Cloudinary upload, /i/:slug guest page, RSVP, tracking. Seed templates/packages with `npm run db:seed`; for local testing only use `SEED_DEV_FREE=1 npm run db:seed` (makes packages free)
4. (written, untested) Customer dashboard, My Invitations (duplicate/delete/share), RSVP table + CSV export, Premium-only analytics, Paystack initialize/verify/webhook, payment callback page. Set the Paystack webhook URL to /api/payments/webhook in the Paystack dashboard
5. (written, untested) Admin: overview charts, users (search/suspend/reactivate/detail), invitations, orders, payments, RSVPs, analytics, and database-backed CRUD for templates, products, services, portfolio, coupons and package pricing. Public pages: /invitations, /invitations/templates, /products, /about; sitemap, robots, 404 and error pages. Create the admin with `npm run db:seed`
