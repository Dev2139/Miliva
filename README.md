# MILIVA SKINCARE — Enterprise D2C E-Commerce & Management Platform

A production-ready, high-performance D2C (Direct-To-Consumer) cosmetics e-commerce platform built for **MILIVA Skincare**. The system features a minimalist editorial customer storefront alongside a dedicated, standalone administrative portal for enterprise inventory, order fulfillment, pricing, bundle management, and business analytics.

---

## 🏛️ System Architecture Overview

The MILIVA platform is structured as an enterprise monorepo housing three core decoupled applications:

```
                  ┌─────────────────────────────────────────┐
                  │       Customer Storefront App           │
                  │   (Vite + React 19 + Tailwind CSS)      │
                  └────────────────────┬────────────────────┘
                                       │ REST API / JSON
                                       ▼
┌─────────────────────────┐   ┌─────────────────────────────┐   ┌─────────────────────────┐
│ Cloudinary Media CDN    │◄──┤   Node.js Express Backend   ├──►│ Razorpay Payment Gateway│
└─────────────────────────┘   │ (JWT Auth, RBAC, REST API)  │   └─────────────────────────┘
                              └──────────────┬──────────────┘
                                             │ Mongoose ODM
                                             ▼
                              ┌─────────────────────────────┐
                              │  MongoDB Enterprise Cluster │
                              └─────────────────────────────┘
                                             ▲
                                             │ REST API / JSON
                  ┌──────────────────────────┴──────────────┐
                  │    Standalone Enterprise Admin Portal   │
                  │  (Vite + React 19 + Recharts Dashboard) │
                  └─────────────────────────────────────────┘
```

---

## ✨ Core Features & Modules

### 🛍️ 1. Customer Storefront (`/client`)
* **Editorial Aesthetic**: Tailored luxury visual system utilizing Warm Cream (`#F7F3ED`), Charcoal typography, and responsive micro-interactions.
* **Dynamic Product Catalog**: Supports SKU variations (volume sizes, individual pricing, inventory tracking, active badges like *Best Seller* or *New Arrival*).
* **Synergistic Combo Engine**: Dynamic multi-product bundle engine calculated automatically or manually configured with instant customer savings highlights.
* **Shopping Cart & Express Checkout**: Integrated with **Razorpay Payment Gateway** for online card/UPI payments and Cash on Delivery (COD) workflows.
* **Pincode Serviceability Lookup**: Real-time logistical serviceability lookup with delivery timeline estimates.
* **Customer Portal**: Order history tracking, detailed fulfillment status timeline, dynamic address book manager, and wishlist sync.
* **Social Preview Cards (`/p/:slug`)**: OpenGraph meta endpoint generating dynamic HTML preview cards for WhatsApp, iMessage, Twitter, and Facebook sharing.

### 🖥️ 2. Standalone Enterprise Admin Portal (`/admin`)
* **Executive Analytics**: Real-time sales revenue, Average Order Value (AOV), total order velocity, low stock alerts, and top-selling formulation metrics.
* **Product & Variant Management**: Complete product creation/editing, variant configuration (`100 ml`, `200 ml`, `30 ml`, `50 ml`), pricing control, and promotional badges.
* **Bundle & Combo Builder**: Configure multi-item bundles, set bundle prices, and manage manual or automatic stock inventory links.
* **Order Fulfillment Pipeline**: Full order status tracking (`Pending` → `Confirmed` → `Processing` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered`) and AWB courier assignment.
* **Inventory Control Panel**: Real-time variant-level stock audit with instant restock triggers (`+50` / `-10`).
* **Customer Account Management**: Customer order histories, total lifetime spend, and account access management.
* **Reviews Moderation Panel**: Content moderation workflow for customer product ratings and reviews.
* **Promotions & Coupon Engine**: Flexible percentage or fixed-value discount codes with minimum spend rules and usage tracking.
* **Content Management System (CMS)**: Manage announcement bar text, homepage hero banners, and promotional alerts.
* **Platform Configuration**: Operational settings for free shipping thresholds, support contact routing, and payment gateway keys.

### ⚡ 3. Backend API Engine (`/server`)
* **RESTful Endpoints**: Clean, modular route handlers (`/api/auth`, `/api/products`, `/api/orders`, `/api/cart`, `/api/bundles`, etc.).
* **Security & Auth**: Dual JWT authentication, password encryption via `bcryptjs`, and Role-Based Access Control (`RBAC`) protecting admin routes.
* **Hardened API Protections**: Rate limiting (`express-rate-limit`), Helmet security headers, CORS origin verification, and payload size validation.
* **Cloud & Local Storage**: Scalable image uploads via Cloudinary integration with local fallback support.

---

## 📦 Official Product Catalog Specifications

The platform is pre-configured with MILIVA's flagship product line:

### 1. MILIVA Face Cleanser
* **Category**: Face Cleanser
* **Formulation**: Salicylic Acid (2%), Zinc PCA (1%), Niacinamide (5%)
* **Key Benefits**: Gentle daily cleansing, oil control, acne management, and skin brightening.
* **Configured Variants**:
  * `100 ml` — Price: ₹499 (MRP ₹599) | SKU: `MLV-CLN-100`
  * `200 ml` — Price: ₹799 (MRP ₹999) | SKU: `MLV-CLN-200`

### 2. MILIVA Face Serum
* **Category**: Face Serum
* **Formulation**: Salicylic Acid (2%), Alpha Arbutin (2%), Niacinamide (10%)
* **Key Benefits**: Targeted spot correction, skin tone evening, hyperpigmentation reduction, and acne treatment.
* **Configured Variants**:
  * `30 ml` — Price: ₹599 (MRP ₹699) | SKU: `MLV-SER-30`
  * `50 ml` — Price: ₹899 (MRP ₹1099) | SKU: `MLV-SER-50`

### 3. MILIVA Acne Care Combo (Bundle Product)
* **Category**: Combos & Bundles
* **Inclusions**: 1 × MILIVA Face Cleanser + 1 × MILIVA Face Serum
* **Configurations**:
  * `100 ml Cleanser + 30 ml Serum` — Combo Price: ₹999 (Savings ₹99)
  * `200 ml Cleanser + 50 ml Serum` — Combo Price: ₹1549 (Savings ₹149)

---

## 📂 Repository Directory Structure

```
Miliva/
├── admin/                     # Standalone Enterprise Admin Portal (Vite + React 19)
│   ├── src/
│   │   ├── components/        # Admin Layouts, Sidebar, Topbar, Modals
│   │   ├── context/           # Admin Authentication State Context
│   │   ├── pages/             # 13 Dedicated Admin Dashboard Views
│   │   └── services/          # Admin HTTP API Client
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── client/                    # Customer Storefront Application (Vite + React 19)
│   ├── public/                # Static Assets & Netlify Redirects (_redirects)
│   ├── src/
│   │   ├── components/        # Storefront UI Components & Layouts
│   │   ├── context/           # Cart, Auth, and Wishlist Providers
│   │   ├── pages/             # Storefront Pages (Shop, Cart, Checkout, Tracking)
│   │   └── services/          # Client API Service Layer
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                    # Backend API Server (Node.js + Express + Mongoose)
│   ├── config/                # Database Connection Configuration
│   ├── controllers/           # API Business Logic Controllers
│   ├── middleware/            # Auth JWT, Admin RBAC, Error & Upload Handlers
│   ├── models/                # 11 Mongoose Schemas (User, Product, Order, etc.)
│   ├── routes/                # Express Route Handlers
│   ├── utils/                 # Pincode Serviceability & Helper Utilities
│   ├── .env.example           # Environment Configuration Template
│   ├── seed.js                # Initial System & Catalog Seeding Script
│   ├── cleanup.js             # Database Catalog Reset Utility
│   └── server.js              # Express API Server Entry Point
├── package.json               # Monorepo Root Script Orchestrator
└── README.md                  # System Documentation
```

---

## 🛠️ Prerequisites & Setup

### Requirements
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* **MongoDB**: MongoDB Atlas cluster or local MongoDB instance (v6.0+)
* **Cloudinary**: Cloudinary account credentials (for image hosting)
* **Razorpay**: Merchant Key ID and Secret (for online payments)

---

## ⚙️ Environment Configuration

Create a `.env` file in the `server/` directory based on `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/miliva
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5175
```

---

## 🚀 Quick Start & Development Commands

### 1. Install Dependencies
Install dependencies for root orchestrator, backend server, client storefront, and admin portal in a single command:

```bash
npm run install:all
```

### 2. Seed Initial System Data
Initialize the MongoDB database with official MILIVA categories, catalog products, pricing variants, and system credentials:

```bash
npm run seed
```

### 3. Launch Development Servers
Run the backend API, customer storefront, and admin portal concurrently:

```bash
npm run dev
```

* **Customer Storefront**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000) (Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health))
* **Enterprise Admin Portal**: [http://localhost:5175](http://localhost:5175)

---

## 🔐 Administrative Access & Account Setup

During system initialization (`npm run seed`), initial administrative and store manager accounts are configured:

| Portal | Login URL | Default Role |
| :--- | :--- | :--- |
| **Enterprise Admin Portal** | `http://localhost:5175` | System Administrator |
| **Customer Storefront** | `http://localhost:5173/login` | Verified Customer Account |

> **Security Note**: Administrators should change initial system credentials in production via the Admin Settings page (`/admin/settings`) or environment variables immediately after deployment.

---

## 🌐 Production Build & Deployment Guide

### 1. Build Distribution Bundles
Generate optimized production builds for both the customer application and admin portal:

```bash
npm run build
```
* Customer Storefront Build Output: `client/dist/`
* Admin Portal Build Output: `admin/dist/`

### 2. Deploying Frontends (Netlify / Vercel / Cloudflare)
Both `client` and `admin` applications are built as Single Page Applications (SPAs).

* **Netlify / Vercel Configuration**: Set Publish Directory to `dist`. Ensure redirect rules for client-side routing are present (`_redirects` file included in `client/public/`).
* **Environment Variables**: Set `VITE_API_URL` to point to your live backend API URL.

### 3. Deploying Backend API (Render / Railway / AWS / DigitalOcean)
* Set Node version to `>=18`.
* Configure production environment variables in your server dashboard.
* Build & Start Command:
  ```bash
  npm install --prefix server && npm start --prefix server
  ```
* Ensure `CLIENT_URL` and `ADMIN_URL` are configured in environment variables to allow CORS access from your production frontend domains.

---

## 📡 API Reference Overview

The backend exposes a structured, RESTful API interface:

| Module | Route Base | Description |
| :--- | :--- | :--- |
| **Authentication** | `/api/auth` | Register, login, profile updates, password reset workflows |
| **Products** | `/api/products` | Catalog listing, search, filtering, product detail fetching |
| **Categories** | `/api/categories` | Product category management |
| **Cart** | `/api/cart` | User cart persistence and item management |
| **Wishlist** | `/api/wishlist` | Customer saved items |
| **Addresses** | `/api/addresses` | Delivery address management |
| **Orders** | `/api/orders` | Order creation, status updates, AWB tracking, customer order history |
| **Payments** | `/api/payments` | Razorpay order creation and payment signature verification |
| **Reviews** | `/api/products/:id/reviews` | Verified buyer review submission and moderation |
| **Coupons** | `/api/coupons` | Promo code validation and discount application |
| **Bundles** | `/api/bundles` | Dynamic package & combo offer endpoints |
| **Admin Operations** | `/api/admin` | Analytics, stock management, customer auditing, banner CMS |
| **Uploads** | `/api/upload` | Media image uploads to Cloudinary or local storage |
| **Logistics** | `/api/pincode/:code` | Pincode delivery serviceability lookup |
| **Social Shares** | `/p/:slug` | Dynamic OpenGraph metadata HTML cards for social platforms |

---

## 🔒 Security & Data Compliance

* **Token-Based Authentication**: Secure JWT state validation for customer and admin sessions.
* **Role-Based Access Control (RBAC)**: Enforced via `protect` and `admin` middleware on sensitive operational endpoints.
* **Password Hashing**: Strong `bcryptjs` salted password hashing.
* **API Rate Limiting**: Protection against brute-force attacks via `express-rate-limit`.
* **HTTP Security Headers**: Powered by `helmet` security suite.
* **CORS Validation**: Configured origin whitelist to prevent unauthorized cross-origin API invocation.

---

## 📄 License & Intellectual Property

This software and its custom code are property of **MILIVA Skincare**. All rights reserved. Authorized for production deployment and maintenance for MILIVA commercial operations.

