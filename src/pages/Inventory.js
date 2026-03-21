import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/api";

const getRole = () => {
  const role = localStorage.getItem("role") || localStorage.getItem("userRole");
  return role ? role.toLowerCase() : "";
};

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteInProgressId, setDeleteInProgressId] = useState(null);
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
      const data = await apiRequest({
        method: "GET",
        url: "/inventory/",
      });

      const list = Array.isArray(data) ? data : data?.products || [];
      setProducts(list);
    } catch (_error) {
      setErrorMessage("Unable to load inventory right now.");
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
    setForm({
      product_name: "",
      description: "",
      price: "",
      quantity: "",
      threshold: "",
    });
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await apiRequest({
        method: "POST",
        url: "/inventory/",
        data: {
          product_name: form.product_name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          quantity: Number(form.quantity),
          threshold: Number(form.threshold),
        },
      });

      setShowAddModal(false);
      resetForm();
      fetchProducts();
    } catch (_error) {
      setErrorMessage("Unable to add product right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    setErrorMessage("");
    setDeleteInProgressId(productId);

    try {
      await apiRequest({
        method: "DELETE",
        url: `/inventory/${productId}`,
      });
      setProducts((prev) =>
        prev.filter((item) => (item.product_id ?? item.id) !== productId)
      );
    } catch (_error) {
      setErrorMessage("Unable to delete this product right now.");
    } finally {
      setDeleteInProgressId(null);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Inventory</h2>
        {isAdmin && (
          <button type="button" className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            Add Product
          </button>
        )}
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status" aria-label="Loading inventory">
            <span className="visually-hidden">Loading inventory...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Threshold</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="text-center text-muted py-4">
                    No products found. Click "Add Product" to get started
                  </td>
                </tr>
              ) : (
                products.map((product, index) => {
                  const id = product.product_id ?? product.id ?? index;
                  const quantity = Number(product.quantity ?? 0);
                  const threshold = Number(product.threshold ?? 0);
                  const isLowStock = quantity <= threshold;

                  return (
                    <tr key={id}>
                      <td>{product.product_name || "-"}</td>
                      <td>{product.description || "-"}</td>
                      <td>{Number(product.price ?? 0).toFixed(2)}</td>
                      <td>{quantity}</td>
                      <td>{threshold}</td>
                      <td>
                        {isLowStock ? (
                          <span className="badge text-bg-danger">Low Stock</span>
                        ) : (
                          <span className="badge text-bg-success">In Stock</span>
                        )}
                      </td>
                      {isAdmin && (
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(id)}
                            disabled={deleteInProgressId === id}
                          >
                            {deleteInProgressId === id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={handleAddProduct}>
                  <div className="modal-header">
                    <h5 className="modal-title">Add New Product</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => setShowAddModal(false)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="product_name" className="form-label">
                        Product Name
                      </label>
                      <input
                        id="product_name"
                        name="product_name"
                        className="form-control"
                        value={form.product_name}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        rows="2"
                        value={form.description}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="row g-3">
                      <div className="col-12 col-md-4">
                        <label htmlFor="price" className="form-label">
                          Price
                        </label>
                        <input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-control"
                          value={form.price}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-12 col-md-4">
                        <label htmlFor="quantity" className="form-label">
                          Quantity
                        </label>
                        <input
                          id="quantity"
                          name="quantity"
                          type="number"
                          min="0"
                          className="form-control"
                          value={form.quantity}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-12 col-md-4">
                        <label htmlFor="threshold" className="form-label">
                          Threshold
                        </label>
                        <input
                          id="threshold"
                          name="threshold"
                          type="number"
                          min="0"
                          className="form-control"
                          value={form.threshold}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAddModal(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Product"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
};

export default Inventory;
