import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import { Activity, TrendingUp, Package, AlertOctagon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
  const [salesTrend, setSalesTrend] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const data = await apiRequest({ method: "GET", url: "/dashboard/summary" });
        if (isMounted) setSummary(data || {});
        
        // Fetch Trends
        const trendData = await apiRequest({ method: "GET", url: "/dashboard/daily-sales" });
        if (isMounted && Array.isArray(trendData)) {
          setSalesTrend(trendData.slice().reverse()); // Reverse to show oldest to newest
        }
      } catch (error) {
        if (error?.response?.status === 403) {
          navigate("/billing", { replace: true });
        } else if (isMounted) {
          setErrorMessage("Unable to load dashboard summary right now.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSummary();
    return () => { isMounted = false; };
  }, [navigate]);

  const totalRevenue = Number(getMetric(summary, ["total_revenue", "revenue"], 0));
  const totalSales = Number(getMetric(summary, ["total_sales", "sales"], 0));
  const totalProducts = Number(getMetric(summary, ["total_products", "products"], 0));
  const lowStockAlerts = Number(getMetric(summary, ["low_stock_alerts", "low_stock"], 0));

  const currencyValue = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalRevenue),
    [totalRevenue]
  );

  return (
    <>
      <div className="mb-5">
        <h6 className="text-warning fw-bold text-uppercase" style={{ letterSpacing: "1px" }}>Intelligence Summary</h6>
        <h1 className="display-3 fw-bolder mb-0" style={{ letterSpacing: "-2px", lineHeight: "1" }}>
          Pulse <br />
          <span style={{ fontStyle: "italic" }}>Dashboard.</span>
        </h1>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <>
        <div className="row g-4">
            
          {/* Main Revenue Card (Black background, distinct style) */}
          <div className="col-12 col-xl-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card border-0 h-100 p-4 rounded-5 shadow-lg" style={{ backgroundColor: "#111111", color: "#ffffff", minHeight: "350px" }}>
              <div className="d-flex align-items-center mb-5">
                <div className="bg-warning text-dark p-2 rounded-circle me-3">
                  <Activity size={20} />
                </div>
                <span className="text-muted fw-semibold">Total Revenue</span>
              </div>
              
              <div className="mt-auto">
                <h1 className="display-2 fw-bolder mb-2" style={{ letterSpacing: "-2px" }}>{currencyValue}</h1>
                <p className="text-success mb-5">
                  <TrendingUp size={16} className="me-1" /> +12.5% vs baseline
                </p>
                <div className="d-flex justify-content-between align-items-end text-muted small pb-2">
                  <span>Projected Impact</span>
                  <span>+3.5k Growth / mo</span>
                </div>
                <div className="progress" style={{ height: "4px" }}>
                  <div className="progress-bar bg-white" style={{ width: "65%" }}></div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Secondary Metric Grid */}
          <div className="col-12 col-xl-7">
            <div className="row g-4 h-100">

              <div className="col-md-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card bg-white border-0 shadow-sm p-4 h-100 rounded-5 d-flex flex-column justify-content-between">
                  <div className="d-flex align-items-center mb-4">
                    <TrendingUp size={20} className="text-primary me-3" />
                    <span className="text-muted fw-semibold">Total Sales</span>
                  </div>
                  <h2 className="display-4 fw-bolder fst-italic mb-4" style={{ letterSpacing: "-1px" }}>
                    {totalSales} <span className="fs-5 text-muted fst-normal">orders</span>
                  </h2>
                  <div className="d-flex align-items-center justify-content-between mt-auto cursor-pointer" onClick={() => navigate("/inventory")} style={{ cursor: "pointer" }}>
                     <span className="fw-semibold text-decoration-underline decoration-2">View Pipeline</span>
                     <div className="bg-dark text-white rounded-circle p-2"><ArrowRight size={16} /></div>
                  </div>
                </motion.div>
              </div>

              <div className="col-md-6">
                 <div className="d-flex flex-column gap-4 h-100">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card bg-white border-0 shadow-sm p-4 rounded-5 h-50">
                      <div className="d-flex align-items-center mb-2">
                        <Package size={20} className="text-muted me-3" />
                        <span className="text-muted fw-semibold">Inventory Products</span>
                      </div>
                      <div className="d-flex align-items-end justify-content-between mt-auto">
                         <span className="text-muted small">Active Catalog</span>
                         <h2 className="mb-0 fw-bold">{totalProducts}</h2>
                      </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}  className={`card border-0 shadow-sm p-4 rounded-5 h-50 ${lowStockAlerts > 0 ? "bg-danger text-white" : "bg-white"}`}>
                      <div className="d-flex align-items-center mb-2">
                        <AlertOctagon size={20} className={lowStockAlerts > 0 ? "text-white me-3" : "text-muted me-3"} />
                        <span className={`fw-semibold ${lowStockAlerts > 0 ? "text-white" : "text-muted"}`}>Low Stock Alerts</span>
                      </div>
                      <div className="d-flex align-items-end justify-content-between mt-auto">
                         <span className={`small ${lowStockAlerts > 0 ? "text-white-50" : "text-muted"}`}>Requires action</span>
                         <h2 className="mb-0 fw-bold">{lowStockAlerts}</h2>
                      </div>
                    </motion.div>
                 </div>
              </div>

            </div>
          </div>

        </div>
        
        <div className="row mt-4">
          <div className="col-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card bg-white border-0 shadow-sm p-4 p-md-5 rounded-5">
               <div className="mb-5 d-flex justify-content-between align-items-center">
                 <h4 className="fw-bolder fst-italic letter-spacing-min-1 text-dark m-0 d-flex align-items-center"><Activity size={24} className="me-2 text-primary" /> Sales Trajectory</h4>
                 <span className="badge bg-light text-muted rounded-pill px-3 py-2 border">Last 30 Days</span>
               </div>
               <div style={{ width: '100%', height: 350 }}>
                 {salesTrend.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={salesTrend}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                       <XAxis 
                         dataKey="date" 
                         tick={{fontSize: 12, fill: '#6c757d'}} 
                         tickLine={false} 
                         axisLine={false} 
                         tickFormatter={(val) => { 
                           const d = new Date(val); 
                           return `${d.getDate()} ${d.toLocaleString('default', {month:'short'})}`; 
                         }} 
                       />
                       <YAxis tick={{fontSize: 12, fill: '#6c757d'}} tickLine={false} axisLine={false} />
                       <Tooltip 
                         cursor={{fill: '#f8f9fa'}} 
                         contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', padding: '12px 20px'}}
                         labelStyle={{fontWeight: 'bold', marginBottom: '8px', color: '#111'}}
                       />
                       <Bar dataKey="count" name="Orders Placed" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                 ) : (
                   <div className="h-100 d-flex align-items-center justify-content-center text-muted fst-italic bg-light rounded-4">No order data available for this period.</div>
                 )}
               </div>
            </motion.div>
          </div>
        </div>
        </>
      )}
    </>
  );
};

export default AdminDashboard;
