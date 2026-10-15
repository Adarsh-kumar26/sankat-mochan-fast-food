# Sankat Mochan Fast Food — Online Ordering App

Customer-facing app for a fast food shop: register/login, browse the menu, add items to
cart, checkout with Cash-on-Delivery or a simulated "Pay Now" demo payment, and track
orders. Includes a minimal admin panel (menu management + order status) for the shop
owner.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth
- **Frontend:** React (Vite), React Router, Axios

## Project Structure

```
backend/     Express API (auth, menu, orders)
frontend/    React customer/admin web app
```

## Option A — Quick Test Mode (no setup, data resets on stop)

```
cd backend
npm install
npm run quick
```

This starts a temporary in-memory MongoDB, auto-seeds the menu + an admin account, and
runs the API on http://localhost:5000 — all in one command. Then in another terminal:

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Admin login: **admin@sankatmochanfastfood.com** / **admin123**.
Data is lost when you stop the backend (Ctrl+C) — fine for quick local testing, not for
showing a client a persistent demo.

## Option B — Persistent local setup

1. Set up MongoDB: either a free MongoDB Atlas cluster, or install MongoDB Community
   Server locally.
2. Put the connection string in `backend/.env` → `MONGO_URI`.
3. `cd backend && npm run seed` — loads sample menu items + creates the admin user.
4. `cd backend && npm run dev` — API on http://localhost:5000.
5. `cd frontend && npm run dev` — app on http://localhost:5173.

## Deploying so a client can see it live

See `DEPLOYMENT.md` for the full step-by-step guide (MongoDB Atlas + Render + Vercel,
all free tiers).

## Features

- Customer registration/login (JWT-based)
- Browse menu by category
- Add/remove items, adjust quantity in cart (persisted in browser storage)
- Checkout with delivery address + phone
- Payment: Cash on Delivery, or a simulated "Pay Now" flow (marks order as PAID
  instantly) — swap this for a real Razorpay/UPI integration later without changing
  the rest of the order flow (see `frontend/src/pages/Checkout.jsx`)
- Order history for each customer
- Admin panel (`/admin`, admin accounts only): add/remove menu items, view all orders,
  update order status (Placed → Preparing → Out for Delivery → Delivered)

## Going to production later

- Replace the simulated payment in `Checkout.jsx` with a real gateway (Razorpay/UPI)
  once the shop owner has a business account and API keys.
