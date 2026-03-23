import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, Box, FileText, TrendingUp, AlertTriangle } from "lucide-react";

// Mockup Data for steps
const DEMO_STEPS = [
  {
    id: 1,
    title: "Register Your Shop",
    subtitle: "Admin signs up and creates a shop profile in seconds.",
    scene: "register"
  },
  {
    id: 2,
    title: "Build Your Inventory",
    subtitle: "Add products with price, stock quantity, and low-stock threshold.",

    scene: "add_product"
  },
  {
    id: 3,
    title: "Assign Your Staff",
    subtitle: "Create cashier accounts and give staff access to the billing panel.",

    scene: "add_staff"
  },
  {
    id: 4,
    title: "Generate a Bill",
    subtitle: "Staff selects products, enters quantity, and the total is calculated instantly.",

    scene: "billing"
  },
  {
    id: 5,
    title: "Instant Invoice",
    subtitle: "A clean invoice is produced with shop name, items, and total amount.",

    scene: "invoice"
  },
  {
    id: 6,
    title: "Stock Updates Automatically",
    subtitle: "The database trigger reduces inventory the moment a sale is recorded.",

    scene: "stock_update"
  },
  {
    id: 7,
    title: "Monitor Your Dashboard",
    subtitle: "Track revenue, top products, and daily sales trends from one screen.",

    scene: "dashboard"
  },
  {
    id: 8,
    title: "Your Shop, Live Online",
    subtitle: "Customers browse your product availability without logging in.",

    scene: "public_view"
  }
];

// --- PHONE SCENES ---

const RegisterScene = () => (
  <div className="d-flex flex-column h-100">
    <h5 className="fw-bolder mb-4">Create Shop</h5>
    <div className="mb-3">
      <label className="form-label text-muted small mb-1">Shop Name</label>
      <div className="bg-white border rounded p-2 text-dark fw-medium shadow-sm">Kerala Electronics Hub</div>
    </div>
    <div className="mb-4">
      <label className="form-label text-muted small mb-1">Category</label>
      <div className="bg-white border rounded p-2 text-dark fw-medium shadow-sm">Electronics</div>
    </div>
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="mt-auto">
      <button className="btn btn-primary w-100 rounded-pill fw-bold shadow">Create Shop</button>
    </motion.div>
  </div>
);

const AddProductScene = () => (
  <div className="d-flex flex-column h-100">
    <h5 className="fw-bolder mb-4">New Product</h5>
    <div className="mb-3">
      <label className="form-label text-muted small mb-1">Product Name</label>
      <div className="bg-white border rounded p-2 text-dark fw-medium shadow-sm">Sony Headphones</div>
    </div>
    <div className="row g-2 mb-3">
      <div className="col-6">
        <label className="form-label text-muted small mb-1">Price</label>
        <div className="bg-white border rounded p-2 text-dark fw-medium shadow-sm text-center">₹2499</div>
      </div>
      <div className="col-6">
        <label className="form-label text-muted small mb-1">Qty</label>
        <div className="bg-white border rounded p-2 text-dark fw-medium shadow-sm text-center">30</div>
      </div>
    </div>
    <div className="mb-4">
      <label className="form-label text-muted small mb-1">Low Stock Threshold</label>
      <div className="bg-white border rounded p-2 text-dark fw-medium shadow-sm">5</div>
    </div>
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="mt-auto">
      <button className="btn btn-primary w-100 rounded-pill fw-bold shadow">Save Product</button>
    </motion.div>
  </div>
);

const AddStaffScene = () => (
  <div className="d-flex flex-column h-100">
    <h5 className="fw-bolder mb-4">Add Staff</h5>
    <div className="mb-3">
      <label className="form-label text-muted small mb-1">Full Name</label>
      <div className="bg-white border rounded p-2 text-dark fw-medium shadow-sm">Sneha Pillai</div>
    </div>
    <div className="mb-3">
      <label className="form-label text-muted small mb-1">Email</label>
      <div className="bg-white border rounded p-2 text-dark fw-medium shadow-sm">cashier@shop.com</div>
    </div>
    <div className="mb-4">
      <label className="form-label text-muted small mb-1">Role</label>
      <div className="bg-light border rounded p-2 text-primary fw-bold text-center border-primary shadow-sm" style={{ backgroundColor: '#eef2ff' }}>
        Staff (Cashier)
      </div>
    </div>
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="mt-auto">
      <button className="btn btn-primary w-100 rounded-pill fw-bold shadow">Create Account</button>
    </motion.div>
  </div>
);

const BillingScene = () => (
  <div className="d-flex flex-column h-100">
    <h5 className="fw-bolder mb-3">Current Bill</h5>
    <div className="bg-white border rounded p-3 mb-2 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="fw-bold">Sony Headphones</span>
        <span className="fw-bold">₹4998</span>
      </div>
      <div className="d-flex justify-content-between text-muted small">
        <span>₹2499 × 2</span>
      </div>
    </div>
    <div className="bg-white border rounded p-3 mb-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="fw-bold">Logitech Mouse</span>
        <span className="fw-bold">₹899</span>
      </div>
      <div className="d-flex justify-content-between text-muted small">
        <span>₹899 × 1</span>
      </div>
    </div>

    <div className="mt-auto bg-dark text-white rounded p-3 shadow">
      <div className="d-flex justify-content-between mb-2">
        <span className="opacity-75">Subtotal</span>
        <span>₹5897</span>
      </div>
      <div className="d-flex justify-content-between mb-2">
        <span className="opacity-75">Discount (-₹100)</span>
        <span className="text-warning">-₹100</span>
      </div>
      <hr className="border-secondary my-2" />
      <div className="d-flex justify-content-between fw-bolder fs-5 mb-3">
        <span>Total</span>
        <span>₹5797</span>
      </div>
      <motion.button initial={{ scale: 0.95 }} animate={{ scale: [1, 1.05, 1] }} transition={{ delay: 0.5, duration: 0.5 }} className="btn btn-primary w-100 rounded-pill fw-bold border-0" style={{ background: 'linear-gradient(90deg, #10b981, #059669)' }}>
        Generate Bill
      </motion.button>
    </div>
  </div>
);

const InvoiceScene = () => (
  <div className="d-flex flex-column h-100 text-center">
    <div className="bg-white rounded p-4 shadow-sm h-100 d-flex flex-column border" style={{ borderTop: "8px solid var(--primary) !important" }}>
      <h4 className="fw-bolder mb-1">INVOICE</h4>
      <p className="text-muted small mb-4">#A00142</p>

      <div className="text-start mb-4">
        <h6 className="fw-bold fs-6 mb-1">Kerala Electronics Hub</h6>
        <p className="text-muted small m-0">Customer: Walk-in</p>
      </div>

      <div className="text-start small mb-auto">
        <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
          <span className="fw-medium">SONY HEADPHONES ×2</span>
          <span>₹4998</span>
        </div>
        <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
          <span className="fw-medium">LOGITECH MOUSE ×1</span>
          <span>₹899</span>
        </div>
        <div className="d-flex justify-content-between mt-3 fw-bold bg-light p-2 rounded">
          <span>TOTAL</span>
          <span className="text-primary fs-5">₹5797</span>
        </div>
      </div>

      <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="btn btn-outline-primary w-100 rounded-pill fw-bold mt-4 d-flex align-items-center justify-content-center gap-2">
        <FileText size={18} /> Download PDF
      </motion.button>
    </div>
  </div>
);

const StockUpdateScene = () => (
  <div className="d-flex flex-column h-100">
    <h5 className="fw-bolder mb-4">Live Inventory</h5>

    <div className="bg-white border rounded p-3 mb-3 shadow-sm position-relative overflow-hidden">
      <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="position-absolute top-0 bottom-0 opacity-25 bg-success" style={{ width: '20px', left: 0, filter: 'blur(10px)' }}></motion.div>
      <div className="d-flex justify-content-between mb-1">
        <span className="fw-bold">Sony Headphones</span>
        <motion.span
          initial={{ color: '#1a1a1a', scale: 1 }}
          animate={{ color: ['#1a1a1a', '#10b981', '#10b981'], scale: [1, 1.2, 1] }}
          transition={{ duration: 1, times: [0, 0.2, 1], delay: 0.5 }}
          className="fw-bold"
        >
          28
        </motion.span>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span className="text-muted small">Min: 5</span>
        <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="badge bg-success bg-opacity-10 text-success rounded-pill px-2" style={{ fontSize: '0.65rem' }}>
          Updated from 30
        </motion.span>
      </div>
    </div>

    <div className="bg-white border rounded p-3 shadow-sm opacity-50">
      <div className="d-flex justify-content-between mb-1">
        <span className="fw-bold">Logitech Mouse</span>
        <span className="fw-bold">14</span>
      </div>
      <div className="text-muted small">Updated from 15</div>
    </div>
  </div>
);

const DashboardScene = () => (
  <div className="d-flex flex-column h-100">
    <h5 className="fw-bolder mb-3">Dashboard</h5>

    <div className="row g-2 mb-3">
      <div className="col-12">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-primary text-white rounded p-3 shadow-sm">
          <div className="d-flex align-items-center mb-1"><TrendingUp size={16} className="me-2 text-white-50" /> <span className="small text-white-50">Total Revenue</span></div>
          <h3 className="m-0 fw-bold">₹28,450</h3>
        </motion.div>
      </div>
      <div className="col-6">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white border rounded p-2 text-center shadow-sm h-100">
          <div className="small text-muted mb-1">Sales Today</div>
          <h4 className="m-0 fw-bold text-success">6</h4>
        </motion.div>
      </div>
      <div className="col-6">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white border border-warning rounded p-2 text-center shadow-sm h-100 position-relative overflow-hidden">
          <div className="position-absolute w-100 h-100 top-0 start-0 bg-warning opacity-10"></div>
          <div className="small text-warning fw-bold mb-1 d-flex align-items-center justify-content-center"><AlertTriangle size={14} className="me-1" /> Alerts</div>
          <h4 className="m-0 fw-bold text-dark">1</h4>
        </motion.div>
      </div>
    </div>

    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-white border rounded p-3 shadow-sm mt-auto">
      <div className="small text-muted mb-2">Weekly Trend</div>
      <div className="d-flex align-items-end gap-1" style={{ height: '60px' }}>
        <div className="bg-light w-100 rounded-top" style={{ height: '30%' }}></div>
        <div className="bg-light w-100 rounded-top" style={{ height: '50%' }}></div>
        <div className="bg-light w-100 rounded-top" style={{ height: '40%' }}></div>
        <div className="bg-light w-100 rounded-top" style={{ height: '70%' }}></div>
        <div className="bg-primary w-100 rounded-top opacity-75" style={{ height: '100%' }}></div>
      </div>
    </motion.div>
  </div>
);

const PublicViewScene = () => (
  <div className="d-flex flex-column h-100 bg-white mx-n3 mt-n5 pt-5 pb-3 px-3">
    <div className="text-center mb-4">
      <h5 className="fw-bolder m-0">Kerala Electronics</h5>
      <p className="small text-muted mb-0">Official Storefront</p>
    </div>

    <div className="row g-2">
      <div className="col-12">
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="border rounded p-3 d-flex align-items-center shadow-sm">
          <div className="bg-light rounded p-2 me-3"><Box size={24} className="text-primary" /></div>
          <div className="flex-grow-1">
            <div className="fw-bold text-dark">Sony Headphones</div>
            <div className="text-primary fw-bolder">₹2499</div>
          </div>
          <span className="badge bg-success bg-opacity-10 text-success rounded-pill">In Stock</span>
        </motion.div>
      </div>
      <div className="col-12">
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="border rounded p-3 d-flex align-items-center shadow-sm">
          <div className="bg-light rounded p-2 me-3"><Box size={24} className="text-muted" /></div>
          <div className="flex-grow-1">
            <div className="fw-bold text-dark">Anker Charger</div>
            <div className="text-primary fw-bolder">₹349</div>
          </div>
          <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill">Low Stock</span>
        </motion.div>
      </div>
    </div>

    <div className="mt-auto text-center">
      <button className="btn btn-dark rounded-pill px-4 btn-sm fw-bold">Browse All Products</button>
    </div>
  </div>
);


const getSceneComponent = (scene) => {
  switch (scene) {
    case "register": return <RegisterScene />;
    case "add_product": return <AddProductScene />;
    case "add_staff": return <AddStaffScene />;
    case "billing": return <BillingScene />;
    case "invoice": return <InvoiceScene />;
    case "stock_update": return <StockUpdateScene />;
    case "dashboard": return <DashboardScene />;
    case "public_view": return <PublicViewScene />;
    default: return null;
  }
};


const DemoPage = () => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const step = DEMO_STEPS[currentStepIndex];

  const nextStep = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      navigate("/"); // Finish demo
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-vh-100 bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* HEADER */}
      <header className="fixed-top w-100 bg-white border-bottom p-3 d-flex justify-content-between align-items-center" style={{ zIndex: 100 }}>
        <Link to="/" className="btn btn-light rounded-pill px-3 fw-bold text-dark text-decoration-none d-flex align-items-center gap-2" style={{ backgroundColor: '#f3f4f6' }}>
          <ArrowLeft size={16} /> Exit Demo
        </Link>
        <div className="d-flex align-items-center">
          <div className="rounded-circle bg-primary me-2" style={{ width: '10px', height: '10px' }}></div>
          <div className="fw-bolder text-dark" style={{ letterSpacing: '1px' }}>SMART INVENTORY</div>
        </div>
        <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill fw-bold" style={{ backgroundColor: '#ecfdf5', color: '#10b981', fontSize: '0.85rem' }}>
          <div className="rounded-circle" style={{ width: '6px', height: '6px', backgroundColor: '#10B981', animation: 'pulse 2s infinite' }}></div> Demo Active
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="container" style={{ paddingTop: '100px', height: '100vh', minHeight: '800px' }}>
        <div className="row align-items-center h-100 pb-5">

          {/* LEFT: Phone Mockup */}
          <div className="col-12 col-lg-6 d-flex justify-content-center position-relative mb-5 mb-lg-0">
            <div className="position-relative" style={{ zIndex: 10 }}>

              {/* Floating Badge */}


              {/* Phone Hardware */}
              <div className="phone-frame shadow-lg bg-white position-relative" style={{ width: '320px', height: '650px', border: '12px solid #1a1a1a', borderRadius: '45px', overflow: 'hidden' }}>
                <div className="position-absolute top-0 start-50 translate-middle-x bg-dark" style={{ width: '130px', height: '28px', borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px', zIndex: 50 }}></div>

                {/* Screen Content Wrapper */}
                <div className="h-100 w-100 position-relative p-4 pt-5 pb-5" style={{ backgroundColor: '#f8f9fa' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="h-100 text-dark"
                    >
                      {getSceneComponent(step.scene)}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Background Drop Shadow Blur */}
            <div className="position-absolute top-50 start-50 translate-middle bg-primary rounded-circle opacity-10" style={{ width: '500px', height: '500px', filter: 'blur(60px)', zIndex: 1 }}></div>

          </div>

          {/* RIGHT: Text Content */}
          <div className="col-12 col-lg-5 offset-lg-1 z-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="d-flex flex-column justify-content-center"
              >
                <div className="d-flex align-items-center mb-1">
                  <h1 className="fw-light text-primary" style={{ fontSize: '5rem', letterSpacing: '-2px', opacity: 0.2 }}>
                    0{step.id}
                  </h1>
                  <div className="ms-4 bg-primary" style={{ height: '1px', width: '120px', opacity: 0.2 }}></div>
                </div>

                <h2 className="display-4 fw-bolder mb-3 text-dark" style={{ letterSpacing: '-1px' }}>{step.title}</h2>
                <p className="lead text-muted mb-5" style={{ maxWidth: '450px', fontSize: '1.25rem', fontStyle: 'italic', opacity: 0.8 }}>
                  "{step.subtitle}"
                </p>

                <div className="d-flex align-items-center gap-3 mb-5">
                  <button
                    className="btn btn-light rounded-circle shadow-sm border d-flex align-items-center justify-content-center"
                    style={{ width: '50px', height: '50px', backgroundColor: '#fff', color: currentStepIndex === 0 ? '#ccc' : '#111' }}
                    onClick={prevStep}
                    disabled={currentStepIndex === 0}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button
                    className="btn btn-primary rounded-pill px-5 shadow fw-bold d-flex align-items-center justify-content-center gap-2"
                    style={{ height: '50px', fontSize: '1.1rem' }}
                    onClick={nextStep}
                  >
                    {currentStepIndex === DEMO_STEPS.length - 1 ? "Finish Demo" : "Play Scenario"} <ChevronRight size={20} />
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="d-flex gap-2">
                  {DEMO_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className="rounded-pill"
                      style={{
                        height: '4px',
                        width: currentStepIndex === i ? '40px' : '12px',
                        backgroundColor: currentStepIndex === i ? 'var(--primary)' : '#e5e7eb',
                        transition: 'all 0.3s ease'
                      }}
                    ></div>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Helper pure CSS for pulse animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}} />
    </div>
  );
};

export default DemoPage;
