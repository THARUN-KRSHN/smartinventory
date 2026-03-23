import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  Store
} from "lucide-react";
import { motion } from "framer-motion";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("Smart Inventory");

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupForm, setSetupForm] = useState({ shop_name: "", category: "", show_price: true, show_stock: true });
  const [setupSaving, setSetupSaving] = useState(false);
  const [userRole, setUserRole] = useState("admin");

  useEffect(() => {
    try {
      const shopId = localStorage.getItem("shop_id");
      const role = localStorage.getItem("role") || localStorage.getItem("userRole") || "admin";
      setUserRole(role.toLowerCase());

      if (role.toLowerCase() === "admin" && (!shopId || shopId === "null" || shopId === "undefined")) {
        setShowSetupModal(true);
      }

      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        // By default, assume the shop name might be passed in user object or fetched.
        // If they enter Shop details, it overrides this.
        setShopName(user?.shop_name || "Smart Inventory");
      }
    } catch (e) {}
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    setSetupSaving(true);
    try {
      const data = await apiRequest({
        method: "POST",
        url: "/shops/",
        data: setupForm,
      });
      const newId = data?.shop_id ?? data?.id ?? data?.shop?.shop_id;
      if (newId) {
        localStorage.setItem("shop_id", String(newId));
      }
      setShopName(setupForm.shop_name);
      setShowSetupModal(false);
      navigate("/dashboard");
    } catch (error) {
      alert("Unable to configure your shop. Please try again.");
    } finally {
      setSetupSaving(false);
    }
  };

  const adminNavItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Inventory", path: "/inventory", icon: <Package size={20} /> },
    { label: "Staff Creation", path: "/staff", icon: <Users size={20} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  const staffNavItems = [
    { label: "Billing", path: "/billing", icon: <LayoutDashboard size={20} /> },
    { label: "Inventory", path: "/inventory", icon: <Package size={20} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={20} /> }
  ];

  const navItems = userRole === "staff" ? staffNavItems : adminNavItems;

  const SidebarContent = () => (
    <div className="d-flex flex-column h-100 p-4" style={{ width: "260px", backgroundColor: "#ffffff", borderRight: "1px solid #f0f0f0" }}>
      {/* Brand */}
      <div className="d-flex align-items-center mb-5 mt-2">
        <div className="bg-warning text-dark p-2 rounded-3 me-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: "45px", height: "45px" }}>
          <Store size={24} />
        </div>
        <div>
          <h5 className="mb-0 fw-bold text-truncate" style={{ maxWidth: "160px" }}>{shopName}</h5>
          <small className="text-muted fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>
            {userRole === "admin" ? "ADMIN PLATFORM" : "STAFF PORTAL"}
          </small>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-grow-1 d-flex flex-column gap-2 mt-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`d-flex align-items-center p-3 rounded-4 text-decoration-none transition-all`}
              style={{
                backgroundColor: isActive ? "#000000" : "transparent",
                color: isActive ? "#ffffff" : "#6c757d",
                fontWeight: isActive ? "600" : "500",
              }}
            >
              <span className={`me-3 ${isActive ? "text-white" : "text-muted"}`}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Footer Logout */}
      <div className="mt-auto border-top pt-4">
        <button
          onClick={handleLogout}
          className="btn btn-link text-muted text-decoration-none d-flex align-items-center p-0 w-100"
          style={{ transition: "color 0.2s" }}
        >
          <LogOut size={20} className="me-3" />
          <span className="fw-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="d-flex vh-100" style={{ backgroundColor: "#fafbfc", overflow: "hidden" }}>
      {/* Desktop Sidebar */}
      <div className="d-none d-lg-block h-100">
        <SidebarContent />
      </div>

      {/* Mobile Bottom Navigation (Floating Pill) */}
      <div className="d-lg-none position-fixed bottom-0 start-50 translate-middle-x mb-4 z-3" style={{ width: "90%", maxWidth: "400px" }}>
        <div className="bg-white rounded-pill shadow-lg d-flex justify-content-between align-items-center p-2 border">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`d-flex align-items-center justify-content-center text-decoration-none transition-all ${isActive ? 'bg-dark text-white rounded-pill px-4 py-2' : 'text-muted p-2'}`}
                style={{ 
                  flex: isActive ? '1' : '0 1 auto',
                  minWidth: isActive ? "110px" : "auto",
                  whiteSpace: "nowrap"
                }}
              >
                <div className="d-flex align-items-center">
                   {item.icon}
                   {isActive && <span className="ms-2 fw-semibold" style={{ fontSize: "14px" }}>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* First Time Setup Modal Overlay */}
      {showSetupModal && (
        <>
          <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark z-3" style={{ opacity: 0.8 }} />
          <div className="position-fixed top-50 start-50 translate-middle z-3 w-100 px-3" style={{ maxWidth: "500px" }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card border-0 shadow-lg p-4 p-md-5 rounded-4">
              <h3 className="fw-bolder mb-2" style={{ letterSpacing: "-1px" }}>Welcome to your Portal <span className="text-warning">✨</span></h3>
              <p className="text-muted mb-4">Let's set up your shop profile first. You can always change this later in Settings.</p>
              
              <form onSubmit={handleSetupSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-uppercase text-secondary">Shop Name</label>
                  <input type="text" className="form-control form-control-lg bg-light border-0 px-3 py-3" value={setupForm.shop_name} onChange={(e) => setSetupForm({...setupForm, shop_name: e.target.value})} required disabled={setupSaving} />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold small text-uppercase text-secondary">Business Category</label>
                  <input type="text" className="form-control form-control-lg bg-light border-0 px-3 py-3" value={setupForm.category} onChange={(e) => setSetupForm({...setupForm, category: e.target.value})} required disabled={setupSaving} />
                </div>
                <button type="submit" className="btn btn-primary w-100 rounded-pill py-3 fw-bold mt-2 shadow-sm" disabled={setupSaving}>
                  {setupSaving ? "Creating Shop..." : "Create My Shop"}
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-grow-1 h-100 overflow-auto position-relative" style={{ paddingBottom: "90px" }}>
        <div className="p-3 p-xl-5 h-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
