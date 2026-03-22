import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const AuthLayout = ({ leftTitle, leftSubtitle, topRightLinks, children }) => {
  return (
    <div className="container-fluid min-vh-100 p-0 m-0 overflow-hidden bg-white">
      <div className="row min-vh-100 g-0">
        {/* LEFT PANEL */}
        <div className="col-12 col-md-5 d-none d-md-flex flex-column justify-content-center px-5 py-5 position-relative" style={{ backgroundColor: "var(--primary)" }}>
          {/* Subtle background decoration */}
          <div className="position-absolute top-0 start-0 w-100 h-100 opacity-25" style={{ 
            backgroundImage: "radial-gradient(circle at 20% 150%, rgba(255,255,255,0.4) 0%, transparent 50%)" 
          }}></div>

          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="position-relative z-1">
            <h1 className="display-4 fw-bolder text-white mb-4" style={{ letterSpacing: "-1px" }}>
              {leftTitle}
            </h1>
            <p className="fs-5 text-white" style={{ opacity: 0.85, fontWeight: "300", fontStyle: "italic" }}>
              {leftSubtitle}
            </p>
          </motion.div>
        </div>

        {/* RIGHT PANEL (Form) */}
        <div className="col-12 col-md-7 d-flex flex-column position-relative">
          {/* HEADER NAV */}
          <div className="d-flex justify-content-between align-items-center p-4 p-md-5">
            <Link to="/" className="text-dark d-flex align-items-center text-decoration-none fw-semibold">
              <ArrowLeft size={20} className="me-2" /> Back
            </Link>
            
            <div className="d-flex gap-3">
              {topRightLinks.map((link, i) => (
                <Link key={i} to={link.to} className="text-secondary text-decoration-none fw-medium" style={{ fontSize: "0.95rem" }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* FORM CONTENT */}
          <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
            <div className="w-100" style={{ maxWidth: "450px" }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                {children}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
