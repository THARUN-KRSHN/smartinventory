import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  Store,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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
              onClick={() => setIsMobileOpen(false)}
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

      {/* Mobile Topbar & Sidebar Overlay */}
      <div className="d-lg-none position-fixed top-0 start-0 w-100 bg-white border-bottom shadow-sm z-3 d-flex justify-content-between align-items-center p-3">
        <div className="d-flex align-items-center">
          <Store className="text-warning me-2" size={24} />
          <h6 className="mb-0 fw-bold">{shopName}</h6>
        </div>
        <button className="btn btn-light border-0 p-2" onClick={() => setIsMobileOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark z-3"
              style={{ opacity: 0.5 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="position-fixed top-0 start-0 h-100 z-3 bg-white shadow-lg"
            >
              <button
                className="btn btn-light position-absolute border-0 p-2"
                style={{ top: "15px", right: "15px" }}
                onClick={() => setIsMobileOpen(false)}
              >
                <X size={24} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
      <div className="flex-grow-1 h-100 overflow-auto position-relative" style={{ paddingTop: "70px", paddingBottom: "30px" }}>
        {/* We remove padding-top on large screens where there's no mobile header */}
        <div className="p-4 p-md-5 h-100" style={{ paddingTop: "0" }}>
          {/* Apply a subtle margin top reset for desktop */}
          <style dangerouslySetInnerHTML={{__html: "@media (min-width: 992px) { .flex-grow-1 { padding-top: 30px !important; } }"}} />
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
