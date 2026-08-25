# Vijaya Cottage — Indian Sweets Web App

Full-stack e-commerce demo for a traditional Indian mithai (sweets) shop: browse a 49-item
catalog — 46 sweets plus a Pure Ghee line — priced in Indian Rupees (₹), view rich product
details, manage a cart, check out, and see an order confirmation.

- **Frontend**: React + React Router + Tailwind CSS (Vite) + Framer Motion for animation
- **Backend**: Node.js + Express
- **Database**: MongoDB (via Mongoose)
- **Currency**: INR (₹). GST is a flat 5%, free shipping over ₹999, otherwise ₹79 flat.

The frontend also works standalone (frontend-only mode) with a bundled fallback product
catalog and locally-generated demo orders if the backend/database isn't running.

**Product photos** — every product has a real photo at `frontend/public/images/products/<slug>.jpg`,
sourced from Wikimedia Commons (freely licensed, verified per-dish) and resized for the web
(max 1200px, ~78% JPEG quality). Attribution for every photo is in
`frontend/public/images/products/CREDITS.md` — required by the CC BY / CC BY-SA licenses.
`ProductImage.jsx` renders the real photo and gracefully falls back to a hand-illustrated
SVG icon (`SweetIcon.jsx`) if an image is missing or fails to load.

**Vendor specialties** — Pure Ghee (`A2 Bilona Desi Ghee`, `Pure Cow Ghee`, `Buffalo Ghee`)
and two South Indian classics (`Mysore Pak`, `Payasam`) are flagged `specialty: true` and get
a pulsing "Specialty" badge on their cards, plus a dedicated "Vendor's specialties" section
on the homepage with a spinning 3D showcase.

**Animation** — scroll-triggered reveals (`Reveal.jsx`), a 3D pointer-tilt hover on every
product card (`TiltCard.jsx`), and a continuously-spinning 3D showcase (`Sweet3DShowcase.jsx`)
built with plain CSS 3D transforms (`perspective` / `rotateY`) driven by Framer Motion.

## Pages

Home · Products · Product Details · Cart · Checkout · Order Confirmation · About · Contact

Product Details includes: name, large image, description, ingredients, price, weight/pack
size options, shelf life, quantity selector, and add to cart.

## 1. Backend setup

```bash
cd backend
cp .env.example .env      # edit MONGODB_URI if needed
npm install
npm run seed               # populates the products collection (49 items, INR pricing)
npm run dev                 # starts the API on http://localhost:5000
```

Requires a running MongoDB instance (local `mongod` or a MongoDB Atlas connection string
in `.env`).

## 2. Frontend setup

```bash
cd frontend
cp .env.example .env      # VITE_API_URL, defaults to http://localhost:5000/api
npm install
npm run dev                 # starts the app on http://localhost:5173
```

If the backend isn't running, the frontend automatically falls back to a local product
catalog and generates a local demo order on checkout, so the full flow can still be
demoed end-to-end.

## API

- `GET /api/products` — list products (`?category=`, `?featured=true`)
- `GET /api/products/:idOrSlug` — single product
- `POST /api/orders` — create an order
  (`{ items:[{productId, weightLabel, qty}], customer, paymentMethod }`)
- `GET /api/orders/:id` — fetch an order

Each product has a `weightOptions` array (e.g. `250g` / `500g` / `1kg`, or `6 pieces` /
`12 pieces` for piece-counted sweets); orders reference a product by id + the chosen
`weightLabel`, and the price is resolved server-side from that option to prevent tampering.
