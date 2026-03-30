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

const generatePDF = async (saleData, shopNameFromState) => {
  const getBase64ImageFromUrl = async (imageUrl) => {
    try {
      const fullUrl = imageUrl.startsWith('/') ? `http://localhost:8000${imageUrl}` : imageUrl;
      const res = await fetch(fullUrl);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch(e) { return null; }
  };

  const shopName = shopNameFromState || localStorage.getItem("shop_name") || "Smart Inventory Shop";
  const shopLogoUrl = saleData?.shop_logo || saleData?.shop?.logo || localStorage.getItem("shop_logo") || "";
  const saleId = saleData?.sale_id ?? "N/A";
  const saleDate = saleData?.date ? new Date(saleData.date).toLocaleString() : new Date().toLocaleString();
  const items = Array.isArray(saleData?.items) ? saleData.items : [];
  const totalAmount = Number(saleData?.total_amount || 0);

  const printHeight = Math.max(140, 100 + (items.length * 9));
  const doc = new jsPDF({
     orientation: "portrait",
     unit: "mm",
     format: [80, printHeight]
  });

  let currentY = 10;
  const pageWidth = 80;
  const rightMargin = pageWidth - 5;

  if (shopLogoUrl) {
    const base64Logo = await getBase64ImageFromUrl(shopLogoUrl);
    if (base64Logo) {
      doc.addImage(base64Logo, "PNG", pageWidth/2 - 10, currentY, 20, 20);
      currentY += 24;
    }
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("CASH RECEIPT", pageWidth / 2, currentY, { align: "center" });
  currentY += 8;
  
  doc.setLineWidth(0.3);
  doc.line(5, currentY, rightMargin, currentY);
  currentY += 5;
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(shopName.substring(0, 30), pageWidth / 2, currentY, { align: "center" });
  currentY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Date: ${saleDate.split(',')[0]}`, 5, currentY);
  currentY += 5;
  doc.text(`Manager: Staff`, 5, currentY);
  currentY += 6;
  
  doc.line(5, currentY, rightMargin, currentY);
  currentY += 5;
  
  doc.setFont("helvetica", "bold");
  doc.text("Description", 5, currentY);
  doc.text("Price", 55, currentY, { align: "right" });
  currentY += 5;

  doc.setFont("helvetica", "normal");
  items.forEach(item => {
      let nameStr = item.product_name || item.name || "-";
      if (nameStr.length > 20) nameStr = nameStr.substring(0, 20) + "..";
      
      doc.text(nameStr, 5, currentY);
      currentY += 4;
      
      const priceText = parseFloat(item.price || 0).toFixed(2);
      const totalText = parseFloat(item.quantity * item.price).toFixed(2);
      
      doc.text(`${item.quantity} x ${priceText}`, 10, currentY);
      doc.text(totalText, 75, currentY, { align: "right" });
      
      currentY += 5;
  });
  
  doc.line(5, currentY, rightMargin, currentY);
  currentY += 5;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Total:", 35, currentY);
  doc.text(`Rs. ${totalAmount.toFixed(2)}`, 75, currentY, { align: "right" });
  currentY += 10;
  
  // QR Code Box Placeholder
  doc.setFillColor(0, 0, 0);
  doc.rect(pageWidth / 2 - 12, currentY, 24, 24, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(pageWidth / 2 - 8, currentY + 4, 16, 16, 'F');
  doc.setFillColor(0, 0, 0);
  doc.rect(pageWidth / 2 - 4, currentY + 8, 8, 8, 'F');
  currentY += 28;
  
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`#${saleId}`, pageWidth / 2, currentY, { align: "center" });
  currentY += 8;
  
  doc.line(5, currentY, rightMargin, currentY);
  currentY += 6;
  
  doc.setFontSize(9);
  doc.text("Thank you for shopping!", pageWidth / 2, currentY, { align: "center" });
  
  doc.save(`${saleId}.pdf`);
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
