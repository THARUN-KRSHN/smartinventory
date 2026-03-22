import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; 
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StaffLogin from "./pages/StaffLogin";
import Settings from "./pages/Settings";
import Inventory from "./pages/Inventory";
import StaffManagement from "./pages/StaffManagement";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import PublicInventory from "./pages/PublicInventory";
import Billing from "./pages/Billing";

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
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isAuthPage = ['/login', '/register', '/staff-login'].includes(location.pathname);
  const isAdminPage = ['/dashboard', '/inventory', '/staff', '/settings', '/billing'].includes(location.pathname);
  const hideNav = isLandingPage || isAuthPage || isAdminPage;

  useEffect(() => {
    fetch("http://localhost:8000/public/shops").catch(() => {});
  }, []);

  return (
    <>
      {!hideNav && (
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
      )}

      <main className={hideNav ? "" : "container py-5"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/public/shop/:shop_name/inventory" element={<PublicInventory />} />
          
          {/* AUTHENTICATED SHARED ROUTES */}
          <Route path="/inventory" element={<ProtectedRoute><AdminLayout><Inventory /></AdminLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />
          
          {/* ADMIN EXCLUSIVE ROUTES */}
          <Route path="/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/staff" element={<ProtectedRoute requiredRole="admin"><AdminLayout><StaffManagement /></AdminLayout></ProtectedRoute>} />
          
          {/* STAFF EXCLUSIVE ROUTES */}
          <Route path="/billing" element={<ProtectedRoute requiredRole="staff"><AdminLayout><Billing /></AdminLayout></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div id="antigravity-theme">
          <AppContent />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;