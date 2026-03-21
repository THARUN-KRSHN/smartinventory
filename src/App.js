import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; 
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShopSetup from "./pages/ShopSetup";
import AdminDashboard from "./pages/AdminDashboard";
import PublicInventory from "./pages/PublicInventory";
import StaffPanel from "./pages/StaffPanel";

function LogoutButton() {
  const { user, logout } = useContext(AuthContext);
  if (!user) return null;

  return (
    <button 
      className="btn btn-primary rounded-pill ms-3 px-4 shadow-sm" 
      type="button" 
      onClick={logout}
    >
      Logout
    </button>
  );
}

function AppContent() {
  useEffect(() => {
    fetch("https://db-project-backend-2ull.onrender.com/public/shops").catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top py-3">
        <div className="container">
          {/* Updated Logo Section */}
          {/* Updated Logo Section: SMART INVENTORY */}
          {/* FORCING NAME CHANGE TO SMART INVENTORY */}
<Link className="navbar-brand d-flex align-items-center" to="/">
  <div className="brand-dot me-2"></div>
  <span className="fw-bolder" style={{ color: '#4285f4', letterSpacing: '1px' }}>SMART</span>
  <span className="fw-light ms-1" style={{ color: '#ffffff', letterSpacing: '1px' }}>INVENTORY</span>
</Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
          >
            <span className="navbar-toggler-icon" />
          </button>
          
          <div className="collapse navbar-collapse" id="mainNavbar">
            <div className="navbar-nav ms-auto align-items-center">
              <Link className="nav-link px-3" to="/">Shops</Link>
              <Link className="nav-link px-3" to="/login">Login</Link>
              <Link className="nav-link px-3" to="/register">Register</Link>
              <Link className="nav-link px-3" to="/dashboard">Dashboard</Link>
              <Link className="nav-link px-3" to="/billing">Billing</Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="container py-5">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/setup-shop" element={<ShopSetup />} />
          <Route path="/public/shop/:shop_name/inventory" element={<PublicInventory />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/billing" element={<StaffPanel />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <div id="antigravity-theme">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;