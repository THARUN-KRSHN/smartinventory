import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";

const ALLOWED_ROLES = ["admin", "staff"];

const getRole = () => {
  const role = localStorage.getItem("role") || localStorage.getItem("userRole");
  return role ? role.toLowerCase() : "";
};

const generatePDF = (saleData, shopNameFromState) => {
  const doc = new jsPDF();
  const shopName =
    shopNameFromState || localStorage.getItem("shop_name") || "Smart Inventory Shop";
  const shopLogo =
    saleData?.shop_logo ||
    saleData?.shop?.logo ||
    localStorage.getItem("shop_logo") ||
    "";
  const saleId = saleData?.sale_id ?? "N/A";
  const saleDate = saleData?.date
    ? new Date(saleData.date).toLocaleString()
    : new Date().toLocaleString();
  const items = Array.isArray(saleData?.items) ? saleData.items : [];
  const totalAmount = Number(saleData?.total_amount || 0);

  // Render logo only when a data URL/base64 image is available.
  if (typeof shopLogo === "string" && shopLogo.startsWith("data:image/")) {
    try {
      doc.addImage(shopLogo, "PNG", 14, 12, 22, 22);
    } catch (_error) {
      // Ignore invalid image formats and continue PDF generation.
    }
  }

  doc.setFontSize(18);
  doc.text("Invoice", 42, 20);
  doc.setFontSize(14);
  doc.text(shopName, 42, 28);

  doc.setFontSize(12);
  doc.text(`Date/Time: ${saleDate}`, 14, 44);
  doc.text(`Invoice ID: ${saleId}`, 14, 52);

  const tableRows = items.map((item) => {
    const qty = Number(item.quantity || 0);
    const price = Number(item.price || 0);
    const subtotal = qty * price;
    return [
      String(item.name || item.product_name || "-"),
      String(qty),
      `₹${price.toFixed(2)}`,
      `₹${subtotal.toFixed(2)}`,
    ];
  });

  autoTable(doc, {
    startY: 62,
    head: [["Product", "Qty", "Price", "Subtotal"]],
    body: tableRows,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [33, 37, 41] },
  });

  const finalY = doc.lastAutoTable?.finalY || 56;
  doc.setFont(undefined, "bold");
  doc.line(14, finalY + 6, 196, finalY + 6);
  doc.setFontSize(14);
  doc.text(`Total Amount: ₹${totalAmount.toFixed(2)}`, 196, finalY + 16, { align: "right" });

  doc.save(`Invoice_${saleId}.pdf`);
};

const StaffPanel = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [cart, setCart] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const { user } = useAuth();

  const role = getRole();
  const canAccess = ALLOWED_ROLES.includes(role);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setErrorMessage("");

      try {
        const data = await apiRequest({
          method: "GET",
          url: `/inventory/search?q=${encodeURIComponent(trimmed)}`,
        });
        const products = Array.isArray(data) ? data : data?.products || [];
        setSearchResults(products);
      } catch (_error) {
        setErrorMessage("Unable to search products right now.");
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const runningTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const price = Number(item.price || 0);
        const quantity = Number(item.quantity || 0);
        return sum + price * quantity;
      }, 0),
    [cart]
  );

  const addToCart = (product) => {
    const productId = product.product_id ?? product.id;
    if (productId === undefined || productId === null) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === productId);
      if (existing) {
        return prev.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: Number(item.quantity) + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          product_id: productId,
          product_name: product.product_name || product.name || "Unnamed Product",
          price: Number(product.price || 0),
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    const normalized = Number(quantity);
    if (!Number.isFinite(normalized)) return;

    setCart((prev) =>
      prev
        .map((item) =>
          item.product_id === productId ? { ...item, quantity: Math.max(0, normalized) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const handleCloseSuccessModal = () => {
    setInvoice(null);
    setCart([]);
    setQuery("");
    setSearchResults([]);
    setErrorMessage("");
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setErrorMessage("Add at least one item to checkout.");
      return;
    }

    setIsCheckingOut(true);
    setErrorMessage("");

    try {
      const payloadItems = cart.map((item) => ({
        product_id: item.product_id,
        quantity: Number(item.quantity),
      }));

      const data = await apiRequest({
        method: "POST",
        url: "/sales/",
        data: { items: payloadItems },
      });

      const saleId = data?.sale_id ?? data?.id ?? data?.sale?.sale_id ?? data?.sale?.id ?? "N/A";
      const saleDate =
        data?.date ?? data?.sale_date ?? data?.created_at ?? data?.sale?.created_at ?? new Date().toISOString();
      const totalAmount = Number(
        data?.total_amount ?? data?.total ?? data?.sale?.total_amount ?? runningTotal
      );
      const saleItems = cart.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        name: item.product_name,
        quantity: Number(item.quantity),
        price: Number(item.price),
      }));

      setInvoice({
        sale_id: saleId,
        date: saleDate,
        total_amount: totalAmount,
        items: saleItems,
      });
    } catch (_error) {
      setErrorMessage("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!canAccess) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-7">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h5 mb-3">Product Search</h2>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by product name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {isSearching && (
              <div className="d-flex align-items-center gap-2 text-muted mb-3">
                <div className="spinner-border spinner-border-sm" role="status" />
                <span>Searching...</span>
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {searchResults.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-muted text-center py-3">
                        {query.trim() ? "No matching products found." : "Start typing to search products."}
                      </td>
                    </tr>
                  ) : (
                    searchResults.map((product, index) => {
                      const id = product.product_id ?? product.id ?? `p-${index}`;
                      return (
                        <tr key={id}>
                          <td>{product.product_name || product.name || "-"}</td>
                          <td>₹{Number(product.price || 0).toFixed(2)}</td>
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => addToCart(product)}
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h5 mb-3">Cart</h2>

            {errorMessage && <div className="alert alert-danger py-2">{errorMessage}</div>}

            <div className="table-responsive mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style={{ width: 90 }}>Qty</th>
                    <th>Subtotal</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-3">
                        Cart is empty.
                      </td>
                    </tr>
                  ) : (
                    cart.map((item) => (
                      <tr key={item.product_id}>
                        <td>{item.product_name}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            className="form-control form-control-sm"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.product_id, e.target.value)}
                          />
                        </td>
                        <td>₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeFromCart(item.product_id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center border-top pt-3">
              <strong>Total</strong>
              <strong>₹{runningTotal.toFixed(2)}</strong>
            </div>

            <button
              type="button"
              className="btn btn-success w-100 mt-3"
              onClick={handleCheckout}
              disabled={isCheckingOut || cart.length === 0}
            >
              {isCheckingOut ? "Processing..." : "Checkout"}
            </button>
          </div>
        </div>
      </div>

      {invoice && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-success">Sale Successful!</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleCloseSuccessModal}
                  />
                </div>
                <div className="modal-body">
                  <div className="d-flex flex-column align-items-center text-center mb-3">
                    <div
                      className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mb-2"
                      style={{ width: 48, height: 48, fontSize: 24, lineHeight: 1 }}
                      aria-label="Success"
                    >
                      ✓
                    </div>
                    <p className="mb-0">Your sale has been recorded successfully.</p>
                  </div>
                  <p className="mb-2">
                    <strong>Sale ID:</strong> {invoice.sale_id}
                  </p>
                  <p className="mb-2">
                    <strong>Date:</strong> {new Date(invoice.date).toLocaleString()}
                  </p>
                  <p className="mb-0">
                    <strong>Total Amount:</strong> ₹{Number(invoice.total_amount || 0).toFixed(2)}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => generatePDF(invoice, user?.shop_name || user?.shop?.shop_name)}
                  >
                    Download PDF
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleCloseSuccessModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
};

export default StaffPanel;
