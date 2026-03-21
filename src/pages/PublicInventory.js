import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiRequest } from '../api/api';

const BASE_URL = "https://db-project-backend-2ull.onrender.com";

const PublicInventory = () => {
  const { shop_name } = useParams();
  const [shopName, setShopName] = useState(shop_name || "");
  const [products, setProducts] = useState([]);
  const [showPrice, setShowPrice] = useState(true);
  const [showStock, setShowStock] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchPublicInventory = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        // Public endpoint: explicitly send no Authorization header.
        const response = await axios.get(
          `${BASE_URL}/public/shop/${encodeURIComponent(shop_name || "")}/inventory?q=${encodeURIComponent(searchTerm)}`,
          {
            headers: {
              Authorization: undefined,
            },
          }
        );

        if (!isMounted) return;

        const data = response?.data || {};
        const inventory = Array.isArray(data) ? data : data?.products || data?.inventory || [];

        setProducts(inventory);
        setShopName(data?.shop_name || shop_name || "");
        setShowPrice(data?.show_price !== undefined ? Boolean(data.show_price) : true);
        setShowStock(data?.show_stock !== undefined ? Boolean(data.show_stock) : true);
      } catch (_error) {
        if (isMounted) {
          setErrorMessage("Unable to load this shop inventory right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPublicInventory();

    return () => {
      isMounted = false;
    };
  }, [shop_name, searchTerm]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="antigravity-spinner" role="status"></div>
        <div className="loader-text">Waking up inventory service...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">{decodeURIComponent(shopName || "Shop")} Inventory</h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {!errorMessage && products.length === 0 && (
        <div className="alert alert-info">No products available right now.</div>
      )}

      <div className="row g-4">
        {products.map((product, index) => {
          const id = product.product_id ?? product.id ?? index;
          return (
            <div className="col-12 col-sm-6 col-lg-4" key={id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-2">{product.product_name || "Unnamed Product"}</h5>
                  {product.description && (
                    <p className="card-text text-muted mb-3">{product.description}</p>
                  )}

                  <ul className="list-unstyled mb-0">
                    {showPrice && (
                      <li>
                        <strong>Price:</strong> ${Number(product.price || 0).toFixed(2)}
                      </li>
                    )}
                    {showStock && (
                      <li>
                        <strong>Available:</strong> {Number(product.quantity || 0)}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PublicInventory;
