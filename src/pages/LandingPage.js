import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

const LandingPage = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchShops = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest({
          method: "GET",
          url: "/public/shops",
        });

        const shopList = Array.isArray(data) ? data : data?.shops || [];

        if (isMounted) {
          setShops(shopList);
        }
      } catch (err) {
        if (isMounted) {
          setError("Unable to load shops right now. Please try again in a moment.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchShops();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status" aria-label="Loading shops">
          <span className="visually-hidden">Loading shops...</span>
        </div>
        <p className="text-muted mt-3 mb-0">Waking up inventory service...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Available Shops</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {!error && shops.length === 0 && (
        <div className="alert alert-info">No shops are available at the moment.</div>
      )}

      <div className="row g-4">
        {shops.map((shop) => (
          <div className="col-12 col-sm-6 col-lg-4" key={shop.shop_name}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-2">{shop.shop_name}</h5>
                <p className="card-text text-muted mb-4">
                  Category: {shop.category || "Uncategorized"}
                </p>
                <button
                  type="button"
                  className="btn btn-primary mt-auto"
                  onClick={() =>
                    navigate(`/public/shop/${encodeURIComponent(shop.shop_name)}/inventory`)
                  }
                >
                  Visit Shop
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
