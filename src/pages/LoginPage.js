import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

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
        data: {
          email,
          password,
        },
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
        if (user.shop_id === null) {
          navigate("/setup-shop");
        } else {
          navigate("/dashboard");
        }
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
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="h4 mb-4 text-center">Login</h2>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
