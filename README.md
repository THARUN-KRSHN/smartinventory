# 🛒 Smart Inventory & Billing — Frontend

A premium, modern React Single Page Application (SPA) providing distinct, beautifully crafted interfaces for Shop Admins, Staff Cashiers, and Walk-in Customers.

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| UI Library | React 18 |
| Routing | React Router DOM v6 |
| Styling | Bootstrap 5 + Custom CSS |
| Icons | Lucide React |
| Animations | Framer Motion |
| HTTP Client | Axios |
| CSV Parsing | PapaParse |
| PDF Generation | jsPDF |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm start
```
> App runs at `http://localhost:3000`. Requires the FastAPI backend running at `http://localhost:8000`.

---

## 🗂️ Application Pages & Feature Breakdown

### 🌍 Public Pages (No Login Required)

#### `LandingPage.js` — Platform Landing Page
The main marketing and discovery page for the platform:
- **Animated Hero Section** with call-to-action links to register/login.
- **Public Shop Directory**: Dynamically fetches and displays all registered shops with their uploaded Cover Image and Logo.
- **Feature Highlights**: Marketing sections explaining the platform's value proposition.
- **FAQ Accordion**: Collapsible Q&A section for common questions.
- **Curtain Overlay Menu**: A full-screen animated navigation menu for mobile users.
- **Sticky Navbar**: Transparent navbar that transitions to a glass-morphism style on scroll.

#### `PublicInventory.js` — Shop Public Catalog
A cinematic, customer-facing product page for each shop:
- **Shop Hero Banner**: Displays shop name, category badge, and logo over a full-width Cover Image (~70vh height) at a cinematic low opacity.
- **Live Product Grid**: Responsive grid layout showing all in-stock products.
- **Product Cards**: Each card features the product image/photo, name, description, live price, and stock badge (In Stock / Out of Stock), visibility controlled by shop settings.
- **Client-Side Search**: Instant search filtering with no additional API calls.
- **Elegant Empty States**: Fallback illustrations when no products match a search or a shop has no catalog.

---

### 🔐 Auth Pages

#### `Login.js` / `Register.js`
- Clean, minimal forms with inline validation.
- On login success, JWT is stored in `localStorage` alongside `role` and `shop_id`.
- On register success, user is guided to set up their Shop Profile before proceeding.

---

### 🛡️ Admin Panel (Protected — Admin Role Only)

Navigation is powered by `AdminLayout.js`, a persistent sidebar that displays the shop's **uploaded logo** dynamically, the shop name, and contextual navigation links.

#### `Dashboard.js` — Analytics Overview
- **Summary Cards**: Real-time counts of Total Revenue, Total Sales, Total Products, Low-Stock Items.
- **Daily Sales Chart**: A bar chart visualization built from API data showing billing trends over the past days.
- **Top-Selling Products**: A ranked table of best-performing inventory items by quantity sold.
- **Low Stock Alerts**: A live table flagging products below their configured threshold.

#### `Inventory.js` — Product Management
- **Full Product Table**: Lists all inventory with thumbnail image, name, description, price, quantity/threshold, and status badge.
- **Mobile Card View**: Automatically switches to a compact card-based layout on mobile screens.
- **Add/Edit Product Modal**: A rich inline modal supporting:
  - Text fields for name, description, price, qty, threshold.
  - **Dual Image Input Modes**: Toggle between pasting an external image URL or directly uploading a file.
  - Live image preview before saving.
- **Low Stock Toast Notification**: A floating alert appears at the top of the screen when any products fall below their threshold.
- **CSV Bulk Import**:
  - **Download Template Button**: Instantly generates and downloads a pre-formatted `inventory_template.csv` showing the exact required columns (`product_name, description, price, quantity, threshold`).
  - **Import CSV Button**: Parses a selected CSV file client-side using PapaParse, validates rows, and sends the data in a single request to the `/inventory/bulk` endpoint.
- **Delete Product**: Admin-only trash icon instantly removes a product from the database.

#### `StaffManagement.js` — Staff Administration
- **Create Staff Form**: A panel to input Full Name, Email, and Password to securely create a new staff Supabase account.
- **Staff List with Checkboxes**:
  - Every staff row has a **checkbox** for individual selection.
  - A **master "Select All" checkbox** in the header selects/deselects all staff simultaneously.
  - When any staff are selected, a red **Delete (N) button** appears dynamically.
- **Bulk Delete**: Sends an array of selected `user_ids` to `/auth/staff/bulk-delete` to simultaneously remove multiple users from Supabase Auth and the database.
- **Individual Delete**: Trash icon on each row removes a single staff member.
- **CSV Bulk Import**:
  - **Download Template**: Generates `staff_template.csv` with columns (`full_name, email, password`).
  - **Import CSV**: Parses and sends staff array to `/auth/staff/bulk` endpoint.

#### `Settings.js` — Shop Branding
- Update shop name and category.
- Upload or paste a link for **Shop Logo** (displayed in sidebar and public catalog).
- Upload or paste a link for **Cover Banner Image** (displayed on public catalog hero and landing page shop cards).
- Toggle `show_price` and `show_stock` visibility on the public catalog.

---

### 💼 Staff & Admin Panel — Shared

#### `Billing.js` (Admin) / `StaffPanel.js` (Staff)
The Point-of-Sale (POS) checkout terminal:
- **Product Search**: Search the shop's inventory by product name instantly.
- **Cart System**: Add products with quantity selectors; remove individual items.
- **Real-Time Calculations**: Live subtotal, 18% tax, and grand total.
- **Customer Details**: Optional fields for customer name and phone number captured before generating the bill.
- **Thermal Receipt PDF Generation**:
  - Generates a compact **80mm-width** retail-style receipt (not A4).
  - Embeds the **shop logo** dynamically fetched and converted to base64.
  - Includes biller/shop info, customer info, itemized list with prices, subtotal, tax, and grand total.
  - Automatically triggers a file download.
- **Submit Sale**: Finishes the checkout, records the transaction, and decrements inventory.

---

## 📁 Folder Structure
```
src/
├── api/
│   └── api.js          # Axios instance with JWT interceptor
├── components/
│   ├── AdminLayout.js  # Sidebar + topnav with dynamic shop logo
│   └── ProtectedRoute.js
├── pages/
│   ├── LandingPage.js
│   ├── PublicInventory.js
│   ├── Login.js
│   ├── Register.js
│   ├── ShopSetup.js
│   ├── Dashboard.js
│   ├── Inventory.js
│   ├── StaffManagement.js
│   ├── Billing.js
│   ├── StaffPanel.js
│   └── Settings.js
├── App.js              # Main router configuration
└── App.css             # Global design tokens and utility styles
```
