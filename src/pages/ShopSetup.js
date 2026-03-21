<<<<<<< HEAD
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

const ShopSetup = () => {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("");
  const [category, setCategory] = useState("");
  const [showPrice, setShowPrice] = useState(true);
  const [showStock, setShowStock] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const data = await apiRequest({
        method: "POST",
        url: "/shops/",
        data: {
          shop_name: shopName,
          category,
          show_price: showPrice,
          show_stock: showStock,
        },
      });

      const createdShopId = data?.shop_id ?? data?.id ?? data?.shop?.shop_id ?? data?.shop?.id;

      if (createdShopId !== undefined && createdShopId !== null) {
        localStorage.setItem("shop_id", String(createdShopId));
      }

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Unable to create shop right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-9 col-lg-7">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="h4 mb-3">Set Up Your Shop</h2>
            <p className="text-muted mb-4">
              Create your first shop to continue. You can upload your shop logo later in Settings.
            </p>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="shopName" className="form-label">
                  Shop Name
                </label>
                <input
                  id="shopName"
                  type="text"
                  className="form-control"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <input
                  id="category"
                  type="text"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-check mb-2">
                <input
                  id="showPrice"
                  type="checkbox"
                  className="form-check-input"
                  checked={showPrice}
                  onChange={(e) => setShowPrice(e.target.checked)}
                  disabled={isSubmitting}
                />
                <label htmlFor="showPrice" className="form-check-label">
                  Show prices publicly
                </label>
              </div>

              <div className="form-check mb-4">
                <input
                  id="showStock"
                  type="checkbox"
                  className="form-check-input"
                  checked={showStock}
                  onChange={(e) => setShowStock(e.target.checked)}
                  disabled={isSubmitting}
                />
                <label htmlFor="showStock" className="form-check-label">
                  Show stock availability publicly
                </label>
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? "Creating Shop..." : "Create Shop"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSetup;
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

const ShopSetup = () => {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("");
  const [category, setCategory] = useState("");
  const [showPrice, setShowPrice] = useState(true);
  const [showStock, setShowStock] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const data = await apiRequest({
        method: "POST",
        url: "/shops/",
        data: {
          shop_name: shopName,
          category,
          show_price: showPrice,
          show_stock: showStock,
        },
      });

      const createdShopId = data?.shop_id ?? data?.id ?? data?.shop?.shop_id ?? data?.shop?.id;

      if (createdShopId !== undefined && createdShopId !== null) {
        localStorage.setItem("shop_id", String(createdShopId));
      }

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Unable to create shop right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-9 col-lg-7">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="h4 mb-3">Set Up Your Shop</h2>
            <p className="text-muted mb-4">
              Create your first shop to continue. You can upload your shop logo later in Settings.
            </p>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="shopName" className="form-label">
                  Shop Name
                </label>
                <input
                  id="shopName"
                  type="text"
                  className="form-control"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <input
                  id="category"
                  type="text"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-check mb-2">
                <input
                  id="showPrice"
                  type="checkbox"
                  className="form-check-input"
                  checked={showPrice}
                  onChange={(e) => setShowPrice(e.target.checked)}
                  disabled={isSubmitting}
                />
                <label htmlFor="showPrice" className="form-check-label">
                  Show prices publicly
                </label>
              </div>

              <div className="form-check mb-4">
                <input
                  id="showStock"
                  type="checkbox"
                  className="form-check-input"
                  checked={showStock}
                  onChange={(e) => setShowStock(e.target.checked)}
                  disabled={isSubmitting}
                />
                <label htmlFor="showStock" className="form-check-label">
                  Show stock availability publicly
                </label>
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? "Creating Shop..." : "Create Shop"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSetup;
>>>>>>> 6ff3e9ce451d00465204cc98d0f8a0eb1a7c4eeb
