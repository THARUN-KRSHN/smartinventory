import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/api";
import { Plus, Edit2, Trash2, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const getRole = () => {
  const role = localStorage.getItem("role") || localStorage.getItem("userRole");
  return role ? role.toLowerCase() : "";
};

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const [form, setForm] = useState({
    product_name: "",
    description: "",
    price: "",
    quantity: "",
    threshold: "",
  });

  const isAdmin = useMemo(() => getRole() === "admin", []);

  const fetchProducts = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await apiRequest({ method: "GET", url: "/inventory/" });
      const list = Array.isArray(data) ? data : data?.products || [];
      setProducts(list);
    } catch (_error) {
      setErrorMessage("Unable to load inventory data right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ product_name: "", description: "", price: "", quantity: "", threshold: "" });
    setIsEditing(false);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setForm({
      product_name: product.product_name || "",
      description: product.description || "",
      price: product.price || "",
      quantity: product.quantity || "",
      threshold: product.threshold || "",
    });
    setEditingId(product.product_id ?? product.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const payload = {
        product_name: form.product_name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
        threshold: Number(form.threshold),
      };

      if (isEditing) {
        await apiRequest({
          method: "PUT",
          url: `/inventory/${editingId}`,
          data: payload,
        });
      } else {
        await apiRequest({
          method: "POST",
          url: "/inventory/",
          data: payload,
        });
      }

      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (_error) {
      setErrorMessage(`Unable to ${isEditing ? "update" : "add"} product right now.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setErrorMessage("");
    setDeleteId(productId);

    try {
      await apiRequest({
        method: "DELETE",
        url: `/inventory/${productId}`,
      });
      setProducts((prev) => prev.filter((item) => (item.product_id ?? item.id) !== productId));
    } catch (_error) {
      setErrorMessage("Unable to delete this product right now.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
           <h2 className="display-6 fw-bold mb-0" style={{ letterSpacing: "-1px" }}>Inventory</h2>
           <p className="text-secondary mt-1">Manage and track your products.</p>
        </div>
        <button type="button" className="btn btn-primary rounded-pill px-4 fw-medium shadow-sm d-flex align-items-center" onClick={openAddModal}>
          <Plus size={18} className="me-2" /> Add Product
        </button>
      </div>

      {errorMessage && <div className="alert alert-danger shadow-sm border-0 rounded-4">{errorMessage}</div>}

      <div className="card border-0 shadow-sm rounded-4 flex-grow-1 overflow-hidden" style={{ minHeight: "500px" }}>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100 py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : (
          <div className="table-responsive h-100">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4 py-3 text-uppercase text-secondary" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>Product</th>
                  <th className="py-3 text-uppercase text-secondary" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>Description</th>
                  <th className="py-3 text-uppercase text-secondary" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>Price</th>
                  <th className="py-3 text-uppercase text-secondary" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>Stock</th>
                  <th className="py-3 text-uppercase text-secondary" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>Status</th>
                  <th className="pe-4 py-3 text-end text-uppercase text-secondary" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-5">
                      <div className="d-flex flex-column align-items-center justify-content-center">
                        <div className="bg-light p-4 rounded-circle mb-3"><Package size={32} className="text-secondary" /></div>
                        <h5 className="fw-bold text-dark">No products found</h5>
                        <p className="mb-0">Click "Add Product" to get started.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => {
                    const id = product.product_id ?? product.id ?? index;
                    const quantity = Number(product.quantity ?? 0);
                    const threshold = Number(product.threshold ?? 0);
                    const isLowStock = quantity <= threshold;

                    return (
                      <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} key={id} style={{ height: "64px" }}>
                        <td className="ps-4 fw-semibold">{product.product_name || "-"}</td>
                        <td className="text-muted text-truncate" style={{ maxWidth: "200px" }}>{product.description || "-"}</td>
                        <td>${Number(product.price ?? 0).toFixed(2)}</td>
                        <td><span className="fw-mono">{quantity}</span> <span className="text-muted small">/ {threshold}</span></td>
                        <td>
                          <span className={`badge rounded-pill px-3 py-2 ${isLowStock ? "bg-danger bg-opacity-10 text-danger" : "bg-success bg-opacity-10 text-success"}`}>
                            {isLowStock ? "Low Stock" : "In Stock"}
                          </span>
                        </td>
                        <td className="pe-4 text-end">
                          <button className="btn btn-sm btn-light rounded-circle me-2 p-2 shadow-sm" onClick={() => openEditModal(product)}>
                            <Edit2 size={16} className="text-primary" />
                          </button>
                          {isAdmin && (
                            <button className="btn btn-sm btn-light rounded-circle p-2 shadow-sm" onClick={() => handleDelete(id)} disabled={deleteId === id}>
                              <Trash2 size={16} className={deleteId === id ? "text-muted" : "text-danger"} />
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="position-fixed top-0 start-0 w-100 h-100 bg-dark z-3" onClick={() => !isSubmitting && setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="position-fixed top-50 start-50 translate-middle z-3 w-100 px-3" style={{ maxWidth: "550px" }}>
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <form onSubmit={handleSubmit}>
                  <div className="card-header bg-white border-bottom-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">{isEditing ? "Edit Product" : "Add New Product"}</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)} disabled={isSubmitting} />
                  </div>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <label className="form-label text-secondary fw-semibold small">Product Name</label>
                      <input type="text" name="product_name" className="form-control bg-light border-0 py-2 px-3" value={form.product_name} onChange={handleChange} required disabled={isSubmitting} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-secondary fw-semibold small">Description</label>
                      <textarea name="description" className="form-control bg-light border-0 py-2 px-3" rows="2" value={form.description} onChange={handleChange} disabled={isSubmitting} />
                    </div>
                    <div className="row g-3">
                      <div className="col-12 col-md-4">
                        <label className="form-label text-secondary fw-semibold small">Price</label>
                        <input type="number" name="price" step="0.01" min="0" className="form-control bg-light border-0 py-2 px-3 fw-mono" value={form.price} onChange={handleChange} required disabled={isSubmitting} />
                      </div>
                      <div className="col-12 col-md-4">
                        <label className="form-label text-secondary fw-semibold small">Quantity</label>
                        <input type="number" name="quantity" min="0" className="form-control bg-light border-0 py-2 px-3 fw-mono" value={form.quantity} onChange={handleChange} required disabled={isSubmitting} />
                      </div>
                      <div className="col-12 col-md-4">
                        <label className="form-label text-secondary fw-semibold small">Threshold</label>
                        <input type="number" name="threshold" min="0" className="form-control bg-light border-0 py-2 px-3 fw-mono" value={form.threshold} onChange={handleChange} required disabled={isSubmitting} />
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-light border-top-0 p-4 pt-3 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : isEditing ? "Update Product" : "Save Product"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
