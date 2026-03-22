import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import AuthLayout from "../components/AuthLayout";
import { AlertTriangle, CheckCircle, Sparkles } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await apiRequest({
        method: "POST",
        url: "/auth/register",
        data: {
          full_name: fullName.trim(),
          email: email.trim(),
          password: password,
        },
      });

      setSuccessMessage("Registration successful! Redirecting...");
      setFullName("");
      setEmail("");
      setPassword("");

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const apiMessage = error?.response?.data?.detail || error?.response?.data?.message;
      if (error.code === 'ECONNABORTED') {
        setErrorMessage("Server is taking too long to respond. Please try again.");
      } else if (error.response?.status === 400) {
        setErrorMessage(apiMessage || "This email is already registered.");
      } else {
        setErrorMessage("Unable to register at this time. Please check your connection.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      leftTitle={
        <>
          Grow your <br />
          <span style={{ fontStyle: "italic" }}>business</span>
        </>
      }
      leftSubtitle={<>Join the next-generation retail ecosystem.<br/>Built for speed and simplicity.</>}
      topRightLinks={[
        { label: "Admin Login", to: "/login" },
        { label: "Staff Login", to: "/staff-login" },
      ]}
    >
      <div className="mb-5">
        <h2 className="display-6 fw-bold mb-2 d-flex align-items-center">
          Create User <Sparkles className="ms-2 text-warning" size={28} />
        </h2>
        <p className="text-secondary opacity-75 mb-0 font-monospace small">Enter your details to get started.</p>
        <div className="alert alert-info border-0 bg-light-blue text-primary mt-3 mb-0 rounded-3 py-2 px-3 small d-flex align-items-center">
          <AlertTriangle size={16} className="me-2" />
          Note: Only the admin of the shop needs to register.
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success border-0 shadow-sm d-flex align-items-center py-2 px-3 rounded-pill mb-4 small">
          <CheckCircle size={16} className="me-2 text-success" /> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center py-2 px-3 rounded-pill mb-4 small bg-opacity-75">
          <AlertTriangle size={16} className="me-2 text-danger" /> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            id="full_name"
            type="text"
            className="form-control form-control-lg border-0 bg-light rounded-pill px-4 fs-6 py-3"
            placeholder="full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={isSubmitting}
            style={{ fontStyle: fullName ? "normal" : "italic" }}
          />
        </div>

        <div className="mb-4">
          <input
            id="email"
            type="email"
            className="form-control form-control-lg border-0 bg-light rounded-pill px-4 fs-6 py-3"
            placeholder="business email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={isSubmitting}
            style={{ fontStyle: email ? "normal" : "italic" }}
          />
        </div>

        <div className="mb-4">
          <input
            id="password"
            type="password"
            className="form-control form-control-lg border-0 bg-light rounded-pill px-4 fs-6 py-3"
            placeholder="create password (min. 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={isSubmitting}
            style={{ fontStyle: password ? "normal" : "italic" }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-dark w-100 rounded-pill py-3 fw-bold mt-2 shadow-sm"
          disabled={isSubmitting}
          style={{ transition: "all 0.3s ease" }}
        >
          {isSubmitting ? (
             <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
          ) : null}
          {isSubmitting ? "Registering..." : "Submit & Continue"}
        </button>
      </form>
      
      <div className="text-center mt-5">
        <span className="text-muted small">Already have an account? </span>
        <Link to="/login" className="text-dark fw-bold text-decoration-none small">
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;