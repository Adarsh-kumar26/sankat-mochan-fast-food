# Deploying Sankat Mochan Fast Food (Live Demo for Client)

Three free services, no credit card needed:

- **MongoDB Atlas** — database (data persists)
- **Render** — hosts the backend API
- **Vercel** — hosts the frontend website (this is the link you'll show the client)

Account creation on these sites needs to be done by you (email verification etc.) —
everything else below is copy-paste steps.

---

## Step 1 — Push the code to GitHub

1. Create a new (empty) repository on github.com, e.g. `sankat-mochan-fast-food`.
   Don't add a README/license there — keep it empty.
2. In this project folder, run:
   ```
   git add -A
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
   (Replace the URL with the one GitHub shows you after creating the repo.)

## Step 2 — MongoDB Atlas (free database)

1. Sign up at mongodb.com/atlas → create a **free M0 cluster**.
2. Database Access → add a database user (username + password — save these).
3. Network Access → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) —
   needed so Render can connect.
4. Click **Connect** → "Drivers" → copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sankat_mochan_fast_food
   ```
   Replace `<username>`/`<password>` with the ones you created, and make sure
   `/sankat_mochan_fast_food` is added as the database name at the end.

## Step 3 — Deploy the backend on Render

1. Sign up at render.com (you can sign in with GitHub).
2. **New** → **Web Service** → connect your GitHub repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `MONGO_URI` = the Atlas connection string from Step 2
   - `JWT_SECRET` = any long random string (you can generate one, or ask me to)
   - (Leave `PORT` unset — Render sets it automatically.)
5. Deploy. Once live, Render gives you a URL like:
   ```
   https://sankat-mochan-fast-food-backend.onrender.com
   ```
   Keep this URL — the frontend needs it.

   Note: Render's free tier sleeps after ~15 min of no traffic, so the first request
   after idle time takes a few seconds to wake up — normal for a free demo.

## Step 4 — Load the menu into the live database (one-time)

On your own computer:

1. Open `backend/.env` and temporarily set `MONGO_URI` to the Atlas connection string
   from Step 2 (same one you gave Render).
2. Run:
   ```
   cd backend
   npm run seed
   ```
3. This creates the menu items and the admin account
   (`admin@sankatmochanfastfood.com` / `admin123`) in the **live** database.
4. You can change `backend/.env` back afterwards — it only affects your local testing.

## Step 5 — Deploy the frontend on Vercel

1. Sign up at vercel.com (sign in with GitHub).
2. **Add New** → **Project** → import the same GitHub repo.
3. Settings:
   - **Root Directory:** `frontend`
   - Framework Preset: Vite (should auto-detect)
4. Add Environment Variable:
   - `VITE_API_URL` = `https://sankat-mochan-fast-food-backend.onrender.com/api`
     (your Render URL from Step 3, with `/api` added at the end)
5. Deploy. Vercel gives you a live link like:
   ```
   https://sankat-mochan-fast-food.vercel.app
   ```

## Step 6 — Show the client

Share the Vercel link. That's the live site — anyone can register, browse the menu,
order, and you (as admin) can manage the menu/orders at `/admin`.

## Updating later

Any time you `git push` new changes to GitHub, Render and Vercel automatically
redeploy — no manual steps needed after the first setup.

## When ready to accept real payments

Replace the simulated "Pay Now" step in `frontend/src/pages/Checkout.jsx` with a real
Razorpay/UPI integration once the shop owner has a business account and API keys.
