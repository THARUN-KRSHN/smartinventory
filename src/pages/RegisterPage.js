<<<<<<< HEAD
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

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
      // 1. Send the POST request to the backend
      await apiRequest({
        method: "POST",
        url: "/auth/register",
        data: {
          full_name: fullName.trim(),
          email: email.trim(),
          password: password, // Send the raw string, the backend handles hashing
        },
      });

      // 2. Handle Success
      setSuccessMessage("Registration successful! Redirecting to login...");
      
      // Clear the form fields
      setFullName("");
      setEmail("");
      setPassword("");

      // 3. Wait 2 seconds so the user can see the success message, then redirect
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      // 4. Handle Errors (Timeout, Duplicate Email, etc.)
      console.error("Registration Error:", error);
      
      const apiMessage = error?.response?.data?.detail || error?.response?.data?.message;
      
      if (error.code === 'ECONNABORTED') {
        setErrorMessage("The server is taking too long to respond. Render is likely waking up—please try again in a few seconds.");
      } else if (error.response?.status === 400) {
        setErrorMessage(apiMessage || "This email is already registered.");
      } else {
        setErrorMessage("Unable to register. Please check your connection and try again.");
      }

      // Re-enable the button so the user can try again
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h2 className="h4 text-center mb-4 fw-bold">Create Account</h2>

            {/* Success Alert */}
            {successMessage && (
              <div className="alert alert-success border-0 shadow-sm">
                <i className="bi bi-check-circle-fill me-2"></i>
                {successMessage}
              </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <div className="alert alert-danger border-0 shadow-sm">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="full_name" className="form-label fw-semibold">
                  Full Name
                </label>
                <input
                  id="full_name"
                  type="text"
                  className="form-control form-control-lg bg-light"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control form-control-lg bg-light"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control form-control-lg bg-light"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary btn-lg w-100 shadow-sm ${isSubmitting ? 'disabled' : ''}`} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registering...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="text-center mt-4 text-muted">
              Already have an account? <Link to="/login" className="text-decoration-none">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

=======
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

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
      // 1. Send the POST request to the backend
      await apiRequest({
        method: "POST",
        url: "/auth/register",
        data: {
          full_name: fullName.trim(),
          email: email.trim(),
          password: password, // Send the raw string, the backend handles hashing
        },
      });

      // 2. Handle Success
      setSuccessMessage("Registration successful! Redirecting to login...");
      
      // Clear the form fields
      setFullName("");
      setEmail("");
      setPassword("");

      // 3. Wait 2 seconds so the user can see the success message, then redirect
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      // 4. Handle Errors (Timeout, Duplicate Email, etc.)
      console.error("Registration Error:", error);
      
      const apiMessage = error?.response?.data?.detail || error?.response?.data?.message;
      
      if (error.code === 'ECONNABORTED') {
        setErrorMessage("The server is taking too long to respond. Render is likely waking up—please try again in a few seconds.");
      } else if (error.response?.status === 400) {
        setErrorMessage(apiMessage || "This email is already registered.");
      } else {
        setErrorMessage("Unable to register. Please check your connection and try again.");
      }

      // Re-enable the button so the user can try again
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h2 className="h4 text-center mb-4 fw-bold">Create Account</h2>

            {/* Success Alert */}
            {successMessage && (
              <div className="alert alert-success border-0 shadow-sm">
                <i className="bi bi-check-circle-fill me-2"></i>
                {successMessage}
              </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <div className="alert alert-danger border-0 shadow-sm">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="full_name" className="form-label fw-semibold">
                  Full Name
                </label>
                <input
                  id="full_name"
                  type="text"
                  className="form-control form-control-lg bg-light"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control form-control-lg bg-light"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control form-control-lg bg-light"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary btn-lg w-100 shadow-sm ${isSubmitting ? 'disabled' : ''}`} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registering...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="text-center mt-4 text-muted">
              Already have an account? <Link to="/login" className="text-decoration-none">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

>>>>>>> 6ff3e9ce451d00465204cc98d0f8a0eb1a7c4eeb
export default RegisterPage;