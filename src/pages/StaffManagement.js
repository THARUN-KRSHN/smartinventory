<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

const getRole = () => {
  const role = localStorage.getItem("role") || localStorage.getItem("userRole");
  return role ? role.toLowerCase() : null;
};

const StaffManagement = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (getRole() !== "admin") {
      navigate("/billing", { replace: true });
      return;
    }

    let isMounted = true;

    const fetchStaff = async () => {
      setIsLoadingList(true);

      try {
        const data = await apiRequest({
          method: "GET",
          url: "/auth/staff",
        });

        const staffArray = Array.isArray(data) ? data : data?.staff || [];
        if (isMounted) {
          setStaffList(staffArray);
        }
      } catch (_error) {
        if (isMounted) {
          setErrorMessage("Could not load existing staff list right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingList(false);
        }
      }
    };

    fetchStaff();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const data = await apiRequest({
        method: "POST",
        url: "/auth/staff",
        data: {
          email,
          password,
          full_name: fullName,
        },
      });

      const createdStaff = data?.staff || data?.user || data;
      if (createdStaff?.email && createdStaff?.full_name) {
        setStaffList((prev) => [createdStaff, ...prev]);
      }

      setFullName("");
      setEmail("");
      setPassword("");
      setSuccessMessage("Staff account created successfully.");
    } catch (error) {
      if (error?.response?.status === 403) {
        navigate("/billing", { replace: true });
      } else {
        setErrorMessage("Unable to add staff member. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h5 mb-3">Add New Staff</h2>

            {errorMessage && <div className="alert alert-danger py-2">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success py-2">{successMessage}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

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
                  disabled={isSubmitting}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? "Adding Staff..." : "Add Staff"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-7">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h5 mb-3">Staff Members</h2>

            {isLoadingList ? (
              <div className="d-flex justify-content-center py-4">
                <div className="spinner-border text-primary" role="status" aria-label="Loading staff">
                  <span className="visually-hidden">Loading staff...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Full Name</th>
                      <th scope="col">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="text-center text-muted py-4">
                          No staff members added yet
                        </td>
                      </tr>
                    ) : (
                      staffList.map((staff, index) => (
                        <tr key={staff.id || `${staff.email}-${index}`}>
                          <td>{staff.full_name || staff.name || "-"}</td>
                          <td>{staff.email || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;

=======
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

const getRole = () => {
  const role = localStorage.getItem("role") || localStorage.getItem("userRole");
  return role ? role.toLowerCase() : null;
};

const StaffManagement = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (getRole() !== "admin") {
      navigate("/billing", { replace: true });
      return;
    }

    let isMounted = true;

    const fetchStaff = async () => {
      setIsLoadingList(true);

      try {
        const data = await apiRequest({
          method: "GET",
          url: "/auth/staff",
        });

        const staffArray = Array.isArray(data) ? data : data?.staff || [];
        if (isMounted) {
          setStaffList(staffArray);
        }
      } catch (_error) {
        if (isMounted) {
          setErrorMessage("Could not load existing staff list right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingList(false);
        }
      }
    };

    fetchStaff();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const data = await apiRequest({
        method: "POST",
        url: "/auth/staff",
        data: {
          email,
          password,
          full_name: fullName,
        },
      });

      const createdStaff = data?.staff || data?.user || data;
      if (createdStaff?.email && createdStaff?.full_name) {
        setStaffList((prev) => [createdStaff, ...prev]);
      }

      setFullName("");
      setEmail("");
      setPassword("");
      setSuccessMessage("Staff account created successfully.");
    } catch (error) {
      if (error?.response?.status === 403) {
        navigate("/billing", { replace: true });
      } else {
        setErrorMessage("Unable to add staff member. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h5 mb-3">Add New Staff</h2>

            {errorMessage && <div className="alert alert-danger py-2">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success py-2">{successMessage}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

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
                  disabled={isSubmitting}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? "Adding Staff..." : "Add Staff"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-7">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h5 mb-3">Staff Members</h2>

            {isLoadingList ? (
              <div className="d-flex justify-content-center py-4">
                <div className="spinner-border text-primary" role="status" aria-label="Loading staff">
                  <span className="visually-hidden">Loading staff...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Full Name</th>
                      <th scope="col">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="text-center text-muted py-4">
                          No staff members added yet
                        </td>
                      </tr>
                    ) : (
                      staffList.map((staff, index) => (
                        <tr key={staff.id || `${staff.email}-${index}`}>
                          <td>{staff.full_name || staff.name || "-"}</td>
                          <td>{staff.email || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;

>>>>>>> 6ff3e9ce451d00465204cc98d0f8a0eb1a7c4eeb
