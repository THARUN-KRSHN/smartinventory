import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

const getMetric = (summary, keys, fallback = 0) => {
  for (const key of keys) {
    if (summary?.[key] !== undefined && summary?.[key] !== null) {
      return summary[key];
    }
  }
  return fallback;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [summary, setSummary] = useState({});

  useEffect(() => {
    let isMounted = true;

    const fetchSummary = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const data = await apiRequest({
          method: "GET",
          url: "/dashboard/summary",
        });

        if (isMounted) {
          setSummary(data || {});
        }
      } catch (error) {
        if (error?.response?.status === 403) {
          navigate("/billing", { replace: true });
          return;
        }

        if (isMounted) {
          setErrorMessage("Unable to load dashboard summary right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSummary();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const totalRevenue = Number(getMetric(summary, ["total_revenue", "revenue"], 0));
  const totalSales = Number(getMetric(summary, ["total_sales", "sales"], 0));
  const totalProducts = Number(getMetric(summary, ["total_products", "products"], 0));
  const lowStockAlerts = Number(getMetric(summary, ["low_stock_alerts", "low_stock"], 0));

  const currencyValue = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number.isFinite(totalRevenue) ? totalRevenue : 0),
    [totalRevenue]
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status" aria-label="Loading dashboard">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="row g-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted mb-2">Total Revenue</h6>
              <p className="h3 mb-0">{currencyValue}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted mb-2">Total Sales</h6>
              <p className="h3 mb-0">{totalSales}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted mb-2">Total Products</h6>
              <p className="h3 mb-0">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className={`card h-100 shadow-sm ${lowStockAlerts > 0 ? "border-danger" : ""}`}>
            <div className={`card-body ${lowStockAlerts > 0 ? "text-danger" : ""}`}>
              <h6 className={lowStockAlerts > 0 ? "mb-2" : "text-muted mb-2"}>Low Stock Alerts</h6>
              <p className="h3 mb-0">{lowStockAlerts}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
