import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api/api";
import AuthLayout from "../components/AuthLayout";
import { AlertTriangle, Lock } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const data = await apiRequest({
        method: "POST",
        url: "/auth/login",
        data: { email, password },
      });

      const accessToken = data?.access_token;
      const user = data?.user;

      if (!accessToken || !user) {
        setErrorMessage("Login response is incomplete. Please try again.");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role || "");
      if (user.shop_id !== undefined && user.shop_id !== null) {
        localStorage.setItem("shop_id", String(user.shop_id));
      }

      if (user.role === "admin") {
        navigate("/dashboard");
      } else if (user.role === "staff") {
        navigate("/billing");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        setErrorMessage("Invalid email or password");
      } else {
        setErrorMessage("Unable to log in right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      leftTitle={
        <>
          Welcome <br />
          <span style={{ fontStyle: "italic" }}>Back</span>
        </>
      }
      leftSubtitle={<>Manage your smart inventory.<br/>Everything you need, right here.</>}
      topRightLinks={[
        { label: "Register Shop", to: "/register" },
        { label: "Staff Login", to: "/staff-login" },
      ]}
    >
      <div className="mb-5">
        <h2 className="display-6 fw-bold mb-2 d-flex align-items-center">
          Admin Login <Lock className="ms-3 text-secondary" size={24} />
        </h2>
        <p className="text-secondary opacity-75 mb-0 font-monospace small">Enter your credentials to access your dashboard.</p>
        <div className="alert alert-secondary border-0 bg-light mt-3 mb-0 rounded-3 py-2 px-3 small d-flex align-items-center">
          If you are staff, use the Staff Login portal.
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center py-2 px-3 rounded-pill mb-4 small bg-opacity-75">
          <AlertTriangle size={16} className="me-2 text-danger" /> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
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
          {isSubmitting ? "Signing in..." : "Submit & Continue"}
        </button>
      </form>
      
      <div className="text-center mt-5">
        <span className="text-muted small">Don't have an account? </span>
        <Link to="/register" className="text-dark fw-bold text-decoration-none small">
          Register Shop
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
