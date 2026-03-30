# Smart Inventory - Frontend

This is the frontend application for the **Smart Multi-Tenant Inventory & Billing System**. It provides a sleek, modern, and responsive interface for shop owners, staff members, and public customers to interact with the platform.

## 🚀 Features

### For Shop Owners & Admins
- **Multi-Tenant Architecture:** Manage your unique shop's catalog and settings independently.
- **Dashboard Analytics:** Visual summary of sales, revenue, top products, and low stock alerts.
- **Inventory Management:** Add, edit, and delete products. Set stock tracking thresholds and upload product images.
- **Billing System:** Generate invoices, manage quantities at checkout, and handle real-time sales transactions.
- **Staff Management:** Create and manage staff accounts with restricted access.
- **Shop Branding:** Customize the public view by configuring your Shop Logo and Cover Banner.

### For Staff
- **Restricted Access View:** Dedicated login and interface limited to Billing and Inventory viewing/updating, protecting sensitive dashboard and staff-management settings.

### For Public Customers
- **Public Storefronts:** A beautifully styled landing page showcasing all platform shops.
- **Live Catalogs:** Customers can visit any shop's unique URL to view live inventory and stock availability statuses.

## 🛠️ Technology Stack

- **Framework:** [React (Create React App)](https://react.dev/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Styling:** [Bootstrap 5](https://getbootstrap.com/) & Custom Vanilla CSS
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Network & API:** [Axios](https://axios-http.com/)

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- Make sure the Backend API (FastAPI) is running natively either locally or on a deployed server.

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd smartinventory
   ```

2. Install package dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root of the frontend folder (`smartinventory/.env`) and define your backend API URL. If developing locally:
   ```env
   REACT_APP_API_URL=http://localhost:8000
   ```

4. Start the local development server:
   ```bash
   npm start
   ```

The app will launch in your browser automatically, typically at `http://localhost:3000`.

## 🌐 Deployment

This application is ready to be deployed on platforms like **Vercel** or **Netlify**. 
A `vercel.json` configuration file is already provided to handle client-side routing rewrites for Vercel.

**Steps for Vercel:**
1. Push your code to GitHub.
2. Import the `smartinventory` folder into a new Vercel project.
3. In the Vercel project settings, set the Environment Variable `REACT_APP_API_URL` to point to your deployed backend URL.
4. Deploy!
