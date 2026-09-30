# MILIVA SKINCARE — Official D2C Cosmetics E-Commerce Platform

MILIVA is a production-ready D2C skincare e-commerce platform built specifically for the **MILIVA** brand, featuring a clean, minimalist, editorial visual aesthetic (White, Warm Cream `#F7F3ED`, Soft Beige, Charcoal typography).

---

## 🛍️ Official Product Catalog

The platform contains **ONLY** the official MILIVA product line:

### 1. MILIVA Face Cleanser
* **Category**: Face Cleanser
* **Product Type**: Cleanser
* **Description**: A gentle daily face cleanser formulated for acne-prone skin and brighter-looking skin.
* **Key Ingredients**: Salicylic Acid (2%), Zinc PCA (1%), Niacinamide (5%)
* **Key Benefits**: Helps fight acne, Helps brighten the appearance of skin, Gentle cleansing, Helps remove excess oil and impurities
* **Purchasable Variants**:
  * `100 ml` — ₹499 (MRP ₹599) &bull; SKU: `MLV-CLN-100`
  * `200 ml` — ₹799 (MRP ₹999) &bull; SKU: `MLV-CLN-200`

### 2. MILIVA Face Serum
* **Category**: Face Serum
* **Product Type**: Serum
* **Description**: A targeted facial serum formulated with Salicylic Acid, Alpha Arbutin and Niacinamide for clearer, brighter and more even-looking skin.
* **Key Ingredients**: Salicylic Acid (2%), Alpha Arbutin (2%), Niacinamide (10%)
* **Key Benefits**: Helps reduce the appearance of acne, Helps brighten skin, Helps improve the appearance of uneven skin tone, Helps support clearer-looking skin
* **Purchasable Variants**:
  * `30 ml` — ₹599 (MRP ₹699) &bull; SKU: `MLV-SER-30`
  * `50 ml` — ₹899 (MRP ₹1099) &bull; SKU: `MLV-SER-50`

### 3. MILIVA Acne Care Combo (Bundle Product)
* **Category**: Combos & Bundles
* **Description**: Complete 2-step daily acne fighting and skin brightening routine. Includes 1 × MILIVA Face Cleanser + 1 × MILIVA Face Serum.
* **Purchasable Configurations**:
  * `100 ml Cleanser + 30 ml Serum` — Combo Price: ₹999 (Individual Total: ₹1098, **You Save ₹99**)
  * `200 ml Cleanser + 50 ml Serum` — Combo Price: ₹1549 (Individual Total: ₹1698, **You Save ₹149**)

---

## 🖥️ Standalone Admin Portal (`/admin`)

The Admin Dashboard is built as a **completely standalone management application** (`AdminLayout.jsx`), featuring its own dark/neutral SaaS sidebar, top navigation, search, and notification system:

1. **Dashboard** (`/admin`): Real DB sales revenue, orders count, AOV, registered users, recent orders, low stock warnings, and top selling formulations.
2. **Products** (`/admin/products`): Full product management, variant editor (`100 ml`, `200 ml`, `30 ml`, `50 ml`), price/stock adjustment, and badge toggles.
3. **Categories** (`/admin/categories`): Official MILIVA product category management.
4. **Bundles & Combos** (`/admin/bundles`): Dedicated bundle management to create, edit, or deactivate combos, configure included variants, set combo pricing, and toggle auto/manual inventory calculation.
5. **Inventory** (`/admin/inventory`): Stock levels per variant (`In Stock`, `Low Stock`, `Out of Stock`) with quick restock buttons (`+50` / `-10`).
6. **Orders** (`/admin/orders`): Order table & status update timeline (`Pending -> Confirmed -> Processing -> Packed -> Shipped -> Out for Delivery -> Delivered`) and courier AWB assignment.
7. **Customers** (`/admin/customers`): Customer lifetime spend, total orders, and account status toggles.
8. **Reviews** (`/admin/reviews`): Moderation panel for verified buyer product reviews.
9. **Coupons** (`/admin/coupons`): Percentage or fixed discount coupons with minimum spend limits and usage caps.
10. **Analytics** (`/admin/analytics`): Database-derived sales metrics and date range filters (`Today`, `Yesterday`, `Last 7 days`, `Last 30 days`, `This month`).
11. **Banners / Homepage** (`/admin/banners`): Announcement bar text and hero headline CMS.
12. **Settings** (`/admin/settings`): Platform configuration, free shipping thresholds, and Razorpay gateway keys.

---

## 🔑 Demo Credentials

### Admin Portal Login
* **URL**: `/login` (or navigate to `/admin`)
* **Email**: `admin@miliva.com`
* **Password**: `Admin@123456`

### Customer Login
* **URL**: `/login`
* **Email**: `alex@example.com`
* **Password**: `Customer@123456`

---

## 🚀 Commands & Development Workflow

```bash
# 1. Install dependencies for root, server, and client
npm run install:all

# 2. Seed database with official MILIVA products
npm run seed

# 3. Clean up any leftover demo products from database
npm run cleanup-products

# 4. Start backend & frontend dev servers concurrently
npm run dev

# 5. Production build
npm run build
```

* **Frontend App**: [http://localhost:5173](http://localhost:5173) (or `5174`)
* **Backend API**: [http://localhost:5000](http://localhost:5000)
* **Standalone Admin Portal**: [http://localhost:5173/admin](http://localhost:5173/admin)
