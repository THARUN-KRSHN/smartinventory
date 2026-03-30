import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Globe2,
  LineChart,
  ShieldCheck,
  Smartphone,
  Store,
  Zap,
  Menu,
  X,
  Globe,
  Star
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure bootstrap is loaded

// --- COMPONENT: Curtain Menu Overlay ---
const CurtainMenu = ({ isOpen, onClose }) => {
  const navLinks = [
    { name: "Problem", href: "#problem" },
    { name: "Solution", href: "#solution" },
    { name: "Features", href: "#features" },
    { name: "Shops", href: "#shops" },
    { name: "FAQ", href: "#faq" },
    { name: "Login", href: "/login", isButton: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="fixed-top w-100 vh-100 d-flex flex-column"
          style={{ zIndex: 2000, background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" }}
        >
          {/* Menu Header (Logo + Close) */}
          <div className="container d-flex justify-content-between align-items-center py-4 px-4">
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle bg-white" style={{ width: "12px", height: "12px" }}></div>
              <div className="fw-bolder text-white fs-4" style={{ letterSpacing: "1px" }}>SMART INVENTORY</div>
            </div>
            <button
              onClick={onClose}
              className="btn btn-white rounded-circle shadow-lg p-3 d-flex align-items-center justify-content-center"
              style={{ width: "50px", height: "50px", border: "none", backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Links */}
          <div className="container flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center">
            <div className="d-flex flex-column gap-1">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                >
                  {link.isButton ? (
                    <Link
                      to={link.href}
                      className="btn btn-white rounded-pill px-5 py-3 fw-bold fs-4 shadow-lg text-primary mt-4"
                      style={{ backgroundColor: "white" }}
                      onClick={onClose}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-white text-decoration-none display-3 fw-bold hover-white transition-all d-block py-2"
                      style={{ letterSpacing: "-1px" }}
                      onClick={onClose}
                    >
                      {link.name}
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Social / Info Footer */}
          <div className="container py-5 px-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-4 text-white opacity-75 small">
            <div>Reach out to us at: <a href="mailto:support@smartinventory.com" className="text-white fw-bold">support@smartinventory.com</a></div>
            <div className="d-flex gap-4 fs-5">
              <Globe size={20} />
              <Star size={20} />
              <Zap size={20} />
            </div>
            <div>© 2026 Smart Inventory. All rights reserved.</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ----- COMPONENT: Custom Navbar for Landing Page -----
const LandingNav = ({ onOpenMenu }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`navbar fixed-top transition-all ${scrolled ? "shadow-sm py-2" : "bg-transparent py-4"}`}
      style={{
        transition: "all 0.3s ease",
        zIndex: 1000,
        backgroundColor: scrolled ? "rgba(73, 69, 255, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "none"
      }}
    >
      <div className="container d-flex justify-content-between align-items-center px-4">
        <a className="navbar-brand d-flex align-items-center" href="#hero">
          <div
            className="brand-dot me-2"
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
            }}
          ></div>
          <span className="fw-bolder text-white" style={{ letterSpacing: "1px" }}>SMART</span>
          <span className="fw-light ms-1 text-white" style={{ letterSpacing: "1px" }}>INVENTORY</span>
        </a>

        <button
          className="btn p-2 border-0 shadow-none text-white d-flex align-items-center justify-content-center"
          onClick={onOpenMenu}
        >
          <Menu size={32} />
        </button>
      </div>
    </nav>
  );
};

// ----- COMPONENT: FAQs Accordion -----
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-bottom py-3">
      <button
        className="btn d-flex justify-content-between align-items-center w-100 text-start shadow-none p-0"
        onClick={() => setIsOpen(!isOpen)}
        style={{ fontWeight: "600", fontSize: "1.1rem" }}
      >
        <span>{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={20} className="text-muted" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="text-muted mt-3 mb-0 lh-lg">{answer}</p>
      </motion.div>
    </div>
  );
};

// ----- MAIN LANDING PAGE -----
const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shops, setShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [error, setError] = useState("");

  // const { scrollYProgress } = useScroll();
  // const yPos = useTransform(scrollYProgress, [0, 1], [0, 300]);

  useEffect(() => {
    let isMounted = true;
    const fetchShops = async () => {
      setLoadingShops(true);
      setError("");
      try {
        const data = await apiRequest({ method: "GET", url: "/public/shops" });
        const shopList = Array.isArray(data) ? data : data?.shops || [];
        if (isMounted) setShops(shopList);
      } catch (err) {
        if (isMounted) setError("Unable to load shops right now.");
      } finally {
        if (isMounted) setLoadingShops(false);
      }
    };
    fetchShops();
    return () => { isMounted = false; };
  }, []);

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <div style={{ backgroundColor: "var(--bg-light)", overflowX: "hidden" }}>
      <CurtainMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <LandingNav onOpenMenu={() => setIsMenuOpen(true)} />

      {/* 1. HERO SECTION */}
      <section id="hero" className="landing-hero d-flex align-items-center justify-content-center text-center">
        <div className="container position-relative z-1" style={{ paddingTop: "80px" }}>
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="row justify-content-center">
            <div className="col-lg-8">
              <motion.p variants={fadeUp} className="lead mb-3 fw-medium text-white" style={{ opacity: 0.8 }}>
                Unlock the power of
              </motion.p>
              <motion.h1 variants={fadeUp} className="display-2 mb-4 text-white hero-title" style={{ letterSpacing: "0px", fontWeight: "900" }}>
                Smart Inventory
              </motion.h1>
              <motion.p variants={fadeUp} className="h4 fw-light mb-5 text-white" style={{ opacity: 0.9 }}>
                crafted for the superYou
              </motion.p>

              <motion.div variants={fadeUp} className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <Link to="/register" className="btn-super text-decoration-none">
                  Get Started
                </Link>
                <Link to="/demo" className="btn-super-outline text-decoration-none">
                  View Demo
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Decorative background elements */}

      </section>

      {/* 2. THE PROBLEM */}
      <section id="problem" className="section-padding bg-white">
        <div className="container">
          <div className="row align-items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="col-lg-6 mb-5 mb-lg-0"
            >
              <h6 className="text-uppercase fw-bold mb-3" style={{ color: "var(--primary)" }}>The Problem Existing Now</h6>
              <h2 className="display-5 fw-bold mb-4">Manual tracking is holding your business back.</h2>
              <p className="lead text-muted mb-4">
                Spreadsheets get messy. Stockouts lose customers. Overstocking ties up your cash flow.
                Managing physical retail in a digital world without the right tools is a recipe for disaster.
              </p>
              <ul className="list-unstyled">
                {["Inaccurate stock counts across multiple locations", "Missed expiration dates leading to waste", "Time-consuming manual auditing"].map((item, i) => (
                  <li key={i} className="d-flex align-items-start mb-3">
                    <CheckCircle2 className="text-danger me-3 flex-shrink-0 mt-1" size={20} />
                    <span className="text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <div className="col-lg-5 offset-lg-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-card p-4 shadow-lg position-relative bg-white"
              >
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-danger text-white rounded-circle p-3 me-3">
                    <LineChart size={24} />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">Revenue Lost</h5>
                    <small className="text-muted">Due to poor inventory management</small>
                  </div>
                </div>
                <h2 className="display-4 fw-bold text-danger mb-0">34%</h2>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE SOLUTION */}
      <section id="solution" className="section-padding bg-light-blue" style={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div className="container text-center mb-5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h6 className="text-uppercase fw-bold mb-3" style={{ color: "var(--primary)" }}>What We're Solving</h6>
            <h2 className="display-5 fw-bold mb-4" style={{ color: "black" }}>Redefining the way you <br />manage stock.</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
              We transform chaotic backrooms into streamlined workflows. Total visibility, intelligent alerts, and multi-tenant capabilities built directly into one super platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. KEY FEATURES */}
      <section id="features" className="section-padding bg-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="row g-4"
          >
            {[
              { icon: <Globe2 size={32} />, title: "Multi-Tenant Architecture", desc: "Manage multiple shops or branches from a single unified dashboard." },
              { icon: <Zap size={32} />, title: "Real-Time Sync", desc: "Inventory quantities update instantly across all your platforms and systems." },
              { icon: <Smartphone size={32} />, title: "Public Storefronts", desc: "Give your customers a beautiful public view of your available inventory." },
              { icon: <ShieldCheck size={32} />, title: "Role-Based Access", desc: "Granular permissions for owners, managers, and staff members." },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp} className="col-md-6 col-lg-3">
                <div className="rounded-card p-4 h-100" style={{ border: "1px solid #f0f0f0" }}>
                  <div className="mb-4 text-primary bg-light-blue d-inline-block p-3 rounded-circle">
                    {feature.icon}
                  </div>
                  <h4 className="fw-bold mb-3">{feature.title}</h4>
                  <p className="text-muted mb-0 lh-lg">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. PUBLIC SHOPS */}
      <section id="shops" className="section-padding" style={{ backgroundColor: "#fafafa" }}>
        <div className="container">
          <div className="text-center mb-5">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="display-6 fw-bold mb-3">
              Shops listed in the platform
            </motion.h2>
            <p className="text-muted">Discover and browse through the inventories of our partner shops.</p>
          </div>

          {loadingShops ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center max-w-md mx-auto">{error}</div>
          ) : shops.length === 0 ? (
            <div className="alert alert-info text-center">No shops are available at the moment.</div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="row g-4 justify-content-center"
            >
              {shops.map((shop, i) => (
                <motion.div key={i} variants={fadeUp} className="col-6 col-md-4 col-lg-3">
                  <div className="rounded-card card h-100 shadow-sm border-0">
                    <div className="card-body p-0 d-flex flex-column text-center position-relative">
                      {/* Cover Image Header */}
                      <div className="w-100 bg-secondary" style={{height: "100px", borderTopLeftRadius: "var(--bs-card-border-radius, 1rem)", borderTopRightRadius: "var(--bs-card-border-radius, 1rem)", overflow: "hidden"}}>
                        {shop.cover_image ? (
                          <img src={shop.cover_image.startsWith('/') ? `http://localhost:8000${shop.cover_image}` : shop.cover_image} alt="cover" className="w-100 h-100" style={{objectFit: "cover", opacity: 0.9}} />
                        ) : (
                          <div className="w-100 h-100 bg-primary opacity-25"></div>
                        )}
                      </div>
                      
                      {/* Logo (overlapping) */}
                      <div className="mx-auto bg-white p-1 rounded-circle shadow-sm d-flex justify-content-center align-items-center position-absolute start-50 translate-middle-x" style={{ width: "70px", height: "70px", top: "65px", zIndex: 2 }}>
                        {shop.logo ? (
                           <img src={shop.logo.startsWith('/') ? `http://localhost:8000${shop.logo}` : shop.logo} alt={shop.shop_name} className="w-100 h-100 overflow-hidden" style={{objectFit: "contain", borderRadius: "50%"}} />
                        ) : (
                           <div className="bg-light w-100 h-100 rounded-circle d-flex align-items-center justify-content-center"><Store size={32} className="text-primary" /></div>
                        )}
                      </div>

                      <div className="pt-5 px-4 pb-4 mt-3 d-flex flex-column flex-grow-1">
                        <h4 className="card-title fw-bold mb-2 text-truncate" title={shop.shop_name}>{shop.shop_name}</h4>
                        <p className="card-text text-muted mb-4 text-truncate">
                          {shop.category || "General Store"}
                        </p>
                        <button
                          className="btn btn-outline-primary rounded-pill mt-auto w-100 d-flex align-items-center justify-content-center gap-2"
                          onClick={() => navigate(`/public/shop/${encodeURIComponent(shop.shop_name)}/inventory`)}
                        >
                          Visit Shop <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* 6. FAQS */}
      <section id="faq" className="section-padding bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <h2 className="display-6 fw-bold">Frequently Asked Questions</h2>
              </div>
              <div className="faq-container">
                <FaqItem
                  question="How does Smart Inventory integrate with my existing systems?"
                  answer="Our platform is designed to be highly interoperable via our REST API. You can easily connect your point-of-sale systems, e-commerce platforms, and accounting software directly to your Smart Inventory account."
                />
                <FaqItem
                  question="Is there a limit to how many products I can manage?"
                  answer="No, our database architecture is built to scale. Whether you have 50 unique SKUs or 500,000, Smart Inventory handles it perfectly with no drop in performance."
                />
                <FaqItem
                  question="Can my customers see my stock in real-time?"
                  answer="Yes! This is one of our key features. You can enable a 'Public Storefront' for your shop, allowing customers to browse your available inventory live before visiting your physical location."
                />
                <FaqItem
                  question="Is my data secure?"
                  answer="Absolutely. We use industry-standard encryption for data at rest and in transit. Role-based access control ensures that your staff only sees what they are authorized to see."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="footer pt-5" style={{ backgroundColor: "#111111", color: "#ffffff" }}>
        <div className="container py-5">
          <div className="row border-bottom border-dark pb-5 mb-5 g-4">
            <div className="col-lg-4">
              <h3 className="fw-bolder mb-4">SMART INVENTORY</h3>
              <p className="text-secondary pe-lg-5">
                Redefining inventory management for the modern world. Automate, track, and significantly grow your business today.
              </p>
            </div>
            <div className="col-sm-6 col-lg-2 offset-lg-2">
              <h6 className="fw-bold mb-4 text-uppercase">Platform</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#features" className="text-secondary text-decoration-none hover-white">Features</a></li>
                <li className="mb-2"><a href="#shops" className="text-secondary text-decoration-none hover-white">Public Shops</a></li>
                <li className="mb-2"><Link to="/login" className="text-secondary text-decoration-none hover-white">Login</Link></li>
              </ul>
            </div>
            <div className="col-sm-6 col-lg-2">
              <h6 className="fw-bold mb-4 text-uppercase">Resources</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#faq" className="text-secondary text-decoration-none hover-white">FAQ</a></li>
                <li className="mb-2"><a href="#!" className="text-secondary text-decoration-none hover-white">Support</a></li>
                <li className="mb-2"><a href="#!" className="text-secondary text-decoration-none hover-white">Documentation</a></li>
              </ul>
            </div>
            <div className="col-lg-2">
              <h6 className="fw-bold mb-4 text-uppercase">Legal</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#!" className="text-secondary text-decoration-none hover-white">Privacy Policy</a></li>
                <li className="mb-2"><a href="#!" className="text-secondary text-decoration-none hover-white">Terms of Servcie</a></li>
              </ul>
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h1 className="display-2 fw-bolder mb-0" style={{ color: "#333333", letterSpacing: "-2px" }}>
                Let's be super.
              </h1>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-secondary mb-0">
                Copyright © {new Date().getFullYear()} Smart Inventory Private Limited.<br />All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Simple hover effect for footer links */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .hover-white { transition: color 0.2s ease; }
          .hover-white:hover { color: #ffffff !important; }
          .hero-title {
            font-size: clamp(3rem, 10vw, 6.5rem);
            line-height: clamp(3.5rem, 11vw, 100px);
          }
          @media (max-width: 576px) {
            .hero-title {
              font-size: 3.5rem;
              line-height: 4rem;
            }
          }
        `}} />
      </footer>
    </div>
  );
};

export default LandingPage;
