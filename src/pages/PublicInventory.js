import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, ShoppingBag, Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = "http://localhost:8000";

const PublicInventory = () => {
  const { shop_name } = useParams();
  const [shopInfo, setShopInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        // Fetch Shop Info
        const shopRes = await fetch(`${BASE_URL}/public/shop/${shop_name}`);
        if (!shopRes.ok) throw new Error("Shop not found");
        const shopData = await shopRes.json();
        if (isMounted) setShopInfo(shopData);

        // Fetch Inventory
        const invRes = await fetch(`${BASE_URL}/public/shop/${shop_name}/inventory`);
        if (invRes.ok) {
          const invData = await invRes.json();
          if (isMounted) {
            setProducts(invData);
            setFilteredProducts(invData);
          }
        }
      } catch (err) {
        if (isMounted) setError("This shop might be unavailable or does not exist.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPublicData();
    return () => { isMounted = false; };
  }, [shop_name]);

  // Handle Search Filtering Client-Side or by re-fetching
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const lowerQ = searchQuery.toLowerCase();
      setFilteredProducts(products.filter(p => p.product_name.toLowerCase().includes(lowerQ)));
    }
  }, [searchQuery, products]);

  if (loading) {
    return (
      <div className="vh-100 bg-black d-flex justify-content-center align-items-center">
        <div className="spinner-border text-light" style={{ width: "3rem", height: "3rem" }} role="status" />
      </div>
    );
  }

  if (error || !shopInfo) {
    return (
      <div className="vh-100 bg-black text-white d-flex flex-column align-items-center justify-content-center p-4 text-center">
        <X size={64} className="text-secondary mb-4 opacity-50" />
        <h1 className="display-4 fw-bolder mb-3">{error || "Shop Not Found"}</h1>
        <Link to="/" className="btn btn-outline-light rounded-pill px-5 py-2 mt-4 text-uppercase letter-spacing-1 fw-bold">Return to Platform</Link>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-black text-white position-relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Navigation Layer */}
      <nav className="position-absolute top-0 w-100 z-3 p-4 d-flex justify-content-between align-items-center bg-gradient" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)" }}>
        <Link to="/" className="text-white text-decoration-none d-flex align-items-center opacity-75 hover-opacity-100 transition-all">
          <ArrowLeft size={24} className="me-2" /> <span className="fw-semibold text-uppercase letter-spacing-1 small d-none d-md-inline">Back to Platform</span>
        </Link>
        <div className="d-flex align-items-center">
          <span className="fw-bolder" style={{ color: '#4285f4', letterSpacing: '1px' }}>SMART</span>
          <span className="fw-light ms-1" style={{ color: '#ffffff', letterSpacing: '1px' }}>INVENTORY</span>
        </div>
      </nav>

      {/* Hero Section (Cinematic) */}
      <div className="position-relative w-100" style={{ height: "70vh", minHeight: "500px" }}>

        {/* Abstract Background for Hero */}
        <div className="position-absolute w-100 h-100 z-0 overflow-hidden">
          <div className="w-100 h-100 position-relative" style={{ backgroundColor: "#000" }}>
            {shopInfo.cover_image ? (
               <img src={shopInfo.cover_image.startsWith('/') ? `http://localhost:8000${shopInfo.cover_image}` : shopInfo.cover_image} className="w-100 h-100" style={{objectFit: "cover", opacity: 0.35}} alt="Cover" />
            ) : (
               <div className="position-absolute w-100 h-100 bg-dark z-0"></div>
            )}
          </div>
          {/* Dark Gradient Overlay replacing bottom half to fade into the list */}
          <div className="position-absolute w-100 h-100 top-0 left-0 z-1" style={{ background: "linear-gradient(to top, #000000 0%, transparent 100%)" }}></div>
          <div className="position-absolute w-100 h-100 top-0 left-0 z-1" style={{ background: "linear-gradient(to right, #000000 0%, rgba(0,0,0,0.5) 50%, transparent 100%)" }}></div>
        </div>

        {/* Hero Content */}
        <div className="position-absolute z-2 bottom-0 start-0 w-100 p-4 p-md-5 d-flex flex-column justify-content-end" style={{ paddingBottom: "10vh !important" }}>

          <div className="container-fluid px-0">
            <div className="row">
              <div className="col-12 col-md-8 col-xl-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <div className="d-flex align-items-center mb-3">
                    {shopInfo.logo && (
                      <div className="bg-white p-1 rounded-circle me-3 shadow" style={{width: '60px', height: '60px'}}>
                        <img src={shopInfo.logo.startsWith('/') ? `http://localhost:8000${shopInfo.logo}` : shopInfo.logo} className="w-100 h-100 rounded-circle" style={{objectFit: "contain"}} alt="Logo" />
                      </div>
                    )}
                    <span className="badge bg-light text-dark rounded-pill px-3 py-2 fw-bold text-uppercase letter-spacing-1">
                      {shopInfo.category || "Official Retailer"}
                    </span>
                  </div>
                  <h1 className="display-1 fw-bolder mb-3 text-uppercase" style={{ letterSpacing: "-2px", textShadow: "0 10px 30px rgba(0,0,0,0.5)", lineHeight: "1" }}>
                    {shopInfo.shop_name}
                  </h1>
                  <p className="lead fw-normal text-white-50 mb-5" style={{ maxWidth: "600px" }}>
                    Browse the official catalog and inventory. Real-time availability and verified products direct from the source.
                  </p>

                  <div className="d-flex align-items-center flex-wrap gap-3">
                    {shopInfo.show_stock && (
                      <div className="d-flex align-items-center text-white-50 fs-5">
                        <Package size={20} className="me-2 text-white" /> Live Inventory
                      </div>
                    )}
                    {shopInfo.show_stock && shopInfo.show_price && <span className="text-secondary mx-3">|</span>}
                    {shopInfo.show_price && (
                      <div className="d-flex align-items-center text-white-50 fs-5">
                        <Tag size={20} className="me-2 text-white" /> Market Pricing
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog & Search Section */}
      <div className="position-relative z-3 w-100 bg-black pt-5 pb-5 px-4 px-md-5" style={{ marginTop: "-20px" }}>

        {/* Top bar over the Catalog */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <h3 className="fw-bolder m-0">Explore Catalog</h3>

          {/* Search Input */}
          <div className="position-relative shadow-sm" style={{ maxWidth: "350px", width: "100%" }}>
            <div className="position-absolute top-50 translate-middle-y ms-3 text-white-50">

            </div>
            <input
              type="text"
              className="form-control bg-dark text-white border-0 py-2 ps-5 pe-3 rounded-pill shadow-none"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ backgroundColor: "#151515" }}
            />
          </div>
        </div>

        {/* Product Grid - Replacing standard cards with cinematic posters */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5 text-secondary w-100">
            <ShoppingBag size={48} className="mb-3 opacity-25" />
            <h5>No items found</h5>
          </div>
        ) : (
          <div className="row g-4 pb-5">
            <AnimatePresence>
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.product_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.03 }}
                  className="col-12 col-sm-6 col-md-4 col-xl-3"
                >
                  <div className="card h-100 border-0 overflow-hidden position-relative bg-dark" style={{ borderRadius: "16px", cursor: "pointer", transition: "transform 0.3s ease", backgroundColor: "#111" }}>

                    {/* Product Image Placeholder / Gradient */}
                    <div className="w-100 position-relative bg-secondary overflow-hidden" style={{ aspectRatio: "4/3" }}>
                      {product.image ? (
                        <img src={product.image.startsWith('/') ? `http://localhost:8000${product.image}` : product.image} alt={product.product_name} className="w-100 h-100 object-fit-cover" style={{ transition: "transform 0.3s ease" }} />
                      ) : (
                        <>
                          <div className="w-100 h-100 position-absolute top-0 start-0 z-0 bg-primary opacity-25" style={{ mixBlendMode: "overlay" }}></div>
                          <div className="w-100 h-100 position-absolute top-0 start-0 z-1" style={{ background: "linear-gradient(to top, #111 0%, transparent 100%)" }}></div>
                          <div className="position-absolute top-50 start-50 translate-middle z-2 opacity-10">
                            <ShoppingBag size={64} className="text-white" />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="card-body position-relative z-2 p-4 pt-1 d-flex flex-column text-white">
                      <h5 className="fw-bolder mb-1 text-truncate" title={product.product_name}>{product.product_name}</h5>
                      <p className="small text-white-50 mb-3 text-truncate">{product.description || "Premium Item"}</p>

                      <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25">

                        {/* Price Component */}
                        {shopInfo.show_price && (
                          <div className="d-flex align-items-center">
                            <span className="fw-bolder fs-5 text-white">₹{parseFloat(product.price).toFixed(2)}</span>
                          </div>
                        )}

                        {/* Stock Component */}
                        {shopInfo.show_stock && (
                          <div className="text-end ps-3">
                            {product.quantity > 0 ? (
                              <span className="badge bg-success bg-opacity-25 text-success rounded-pill px-3 py-2 fw-semibold">
                                In Stock: {product.quantity}
                              </span>
                            ) : (
                              <span className="badge bg-danger bg-opacity-25 text-danger rounded-pill px-3 py-2 fw-semibold">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        )}

                        {/* If completely hidden context */}
                        {!shopInfo.show_price && !shopInfo.show_stock && (
                          <span className="badge bg-light text-dark rounded-pill px-3 py-2 w-100 text-center">Available</span>
                        )}

                      </div>
                    </div>

                    {/* Hover State Outline (CSS Class `.hover-card` in future) */}
                    <style dangerouslySetInnerHTML={{
                      __html: `
                           .card:hover { transform: scale(1.02); z-index: 10; box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important; }
                         `}} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
};

export default PublicInventory;
