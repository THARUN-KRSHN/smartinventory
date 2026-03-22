import React, { useState, useEffect } from "react";
import { apiRequest } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, User, Phone, Receipt, FileText, Printer, X, ShoppingBag } from "lucide-react";

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Draft Invoice State
  const [customerName, setCustomerName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [orderItems, setOrderItems] = useState([
    { id: Date.now(), product_id: "", product_name: "", quantity: 1, price: 0 }
  ]);

  // Invoice view state
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const shopName = user?.shop_name || localStorage.getItem("shop_name") || "Smart Inventory";
  const staffName = user?.full_name || user?.name || "Staff Member";

  useEffect(() => {
    let isMounted = true;
    const fetchInventory = async () => {
      try {
        const data = await apiRequest({ method: "GET", url: "/inventory/" });
        const list = Array.isArray(data) ? data : data?.products || [];
        if (isMounted) setProducts(list);
      } catch (e) {
        console.error("Failed to fetch inventory", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchInventory();
    return () => { isMounted = false; };
  }, []);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { id: Date.now(), product_id: "", product_name: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // If they select a product from dropdown, auto-fill price
        if (field === "product_id" && value) {
          const selectedProduct = products.find(p => String(p.product_id ?? p.id) === String(value));
          if (selectedProduct) {
            updatedItem.product_name = selectedProduct.product_name;
            updatedItem.price = selectedProduct.price;
          }
        }
        return updatedItem;
      }
      return item;
    }));
  };

  // Calculations
  const subtotal = orderItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleGenerateInvoice = () => {
    // Validate
    const validItems = orderItems.filter(item => item.product_name.trim() !== "" && item.quantity > 0);
    if (validItems.length === 0) {
      alert("Please add at least one valid item to the invoice.");
      return;
    }

    setInvoiceData({
      invoiceNo: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      customerName: customerName || "Walk-in Customer",
      whatsapp: whatsapp || "N/A",
      items: validItems,
      subtotal,
      gst,
      total,
      shopName,
      billerName: staffName
    });

    setShowInvoice(true);
  };

  const clearDraft = () => {
    setCustomerName("");
    setWhatsapp("");
    setOrderItems([{ id: Date.now(), product_id: "", product_name: "", quantity: 1, price: 0 }]);
  };

  const closeInvoice = () => {
    setShowInvoice(false);
    clearDraft();
  };

  return (
    <div className="row h-100 g-0">
      
      {/* LEFT COLUMN: Order Feed / Background Info */}
      <div className="col-12 col-xl-7 d-none d-xl-flex flex-column h-100 p-5 position-relative align-items-center justify-content-center" style={{ backgroundColor: "#fafbfc" }}>
         <div className="text-center" style={{ filter: "blur(0.5px)", opacity: 0.9 }}>
            <h1 className="fw-bolder" style={{ fontSize: "6rem", letterSpacing: "-4px", color: "#e2e8f0", lineHeight: "1" }}>
              Order<br/>Feed.
            </h1>
            <div className="mt-4">
              <span className="badge bg-dark rounded-pill px-4 py-2 text-uppercase letter-spacing-1">Live Queue</span>
            </div>
         </div>
         {/* Decorative blurred blob */}
         <div className="position-absolute rounded-circle blur-3xl z-0" style={{ width: "300px", height: "300px", backgroundColor: "var(--primary)", opacity: 0.05, top: "20%", left: "20%" }}></div>
      </div>

      {/* RIGHT COLUMN: Draft Invoice Panel */}
      <div className="col-12 col-xl-5 h-100 bg-white border-start position-relative shadow-lg d-flex flex-column z-1 pt-xl-0 pt-4">
        
        {/* Header */}
        <div className="p-4 p-md-5 pb-3 border-bottom bg-white z-2 sticky-top">
           <div className="d-flex justify-content-between align-items-start mb-1">
              <div>
                 <p className="text-muted small mb-0 fst-italic">Locker Engine</p>
                 <h2 className="display-4 fw-bolder fst-italic letter-spacing-min-1 mb-0" style={{ lineHeight: "0.9" }}>Draft<br/>Invoice.</h2>
              </div>
              <div className="bg-warning bg-opacity-25 p-3 rounded-4 d-flex align-items-center justify-content-center">
                 <Receipt size={28} className="text-warning" />
              </div>
           </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-grow-1 overflow-auto p-4 p-md-5 pt-4">
           
           <div className="row g-3 mb-5">
             <div className="col-6">
                <label className="form-label small text-muted fst-italic mb-1">Customer Name</label>
                <div className="input-group bg-light rounded-4 overflow-hidden border">
                   <span className="input-group-text bg-transparent border-0 pe-1"><User size={16} className="text-muted" /></span>
                   <input type="text" className="form-control bg-transparent border-0 py-2 ps-2 shadow-none" placeholder="Name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                </div>
             </div>
             <div className="col-6">
                <label className="form-label small text-muted fst-italic mb-1">WhatsApp #</label>
                <div className="input-group bg-light rounded-4 overflow-hidden border">
                   <span className="input-group-text bg-transparent border-0 pe-1"><Phone size={16} className="text-muted" /></span>
                   <input type="text" className="form-control bg-transparent border-0 py-2 ps-2 shadow-none" placeholder="Number" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
                </div>
             </div>
           </div>

           <div className="d-flex justify-content-between align-items-center mb-3">
              <label className="form-label small text-muted fst-italic mb-0">Order Items</label>
              <button className="btn btn-link text-success text-decoration-none p-0 small fw-bold d-flex align-items-center shadow-none" onClick={handleAddItem}>
                 <Plus size={14} className="me-1"/> Add Item
              </button>
           </div>

           <div className="d-flex flex-column gap-3 mb-5">
              <AnimatePresence>
                {orderItems.map((item, index) => (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={item.id} className="row g-2 align-items-center">
                     <div className="col-6">
                        {loading ? (
                           <input type="text" className="form-control bg-light border-0 rounded-3 py-2 px-3 shadow-none" placeholder="Loading products..." disabled />
                        ) : (
                           <div className="position-relative">
                              <input 
                                list={`products-list-${item.id}`} 
                                className="form-control bg-light border-0 rounded-3 py-2 px-3 shadow-none fw-medium" 
                                placeholder="Product Name" 
                                value={item.product_name} 
                                onChange={(e) => {
                                  // Update name directly so custom items can be typed
                                  handleItemChange(item.id, "product_name", e.target.value);
                                  // If they pick from list, the product_id is captured, otherwise it stays empty for custom items
                                  const selected = products.find(p => p.product_name === e.target.value);
                                  if (selected) {
                                    handleItemChange(item.id, "product_id", selected.product_id ?? selected.id);
                                  }
                                }} 
                              />
                              <datalist id={`products-list-${item.id}`}>
                                 {products.map(p => <option key={p.product_id ?? p.id} value={p.product_name} />)}
                              </datalist>
                           </div>
                        )}
                     </div>
                     <div className="col-2">
                        <input type="number" min="1" className="form-control bg-light border-0 rounded-3 py-2 px-2 text-center shadow-none fw-mono" value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)} />
                     </div>
                     <div className="col-3">
                        <input type="number" min="0" step="0.01" className="form-control bg-light border-0 rounded-3 py-2 px-2 text-center shadow-none fw-mono" placeholder="₹" value={item.price} onChange={(e) => handleItemChange(item.id, "price", e.target.value)} />
                     </div>
                     <div className="col-1 text-end">
                        <button className="btn btn-link text-danger p-0 shadow-none border-0" onClick={() => handleRemoveItem(item.id)} disabled={orderItems.length <= 1}>
                           <Trash2 size={16} className={orderItems.length <= 1 ? "opacity-25" : ""} />
                        </button>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
           
           {/* Totals Section */}
           <div className="d-flex flex-column align-items-end pe-2">
              <div className="d-flex justify-content-between mb-2" style={{ width: "200px" }}>
                 <span className="text-muted small">Subtotal:</span>
                 <span className="fw-mono small">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 border-bottom pb-3" style={{ width: "200px" }}>
                 <span className="text-muted small">GST (18%):</span>
                 <span className="fw-mono small">Rs. {gst.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between text-success" style={{ width: "200px" }}>
                 <span className="fw-bold fs-6">Total:</span>
                 <span className="fw-bolder fw-mono fs-6">Rs. {total.toFixed(2)}</span>
              </div>
           </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 p-md-5 pt-3 border-top bg-white z-2 d-flex gap-3 mt-auto">
           <button className="btn btn-dark rounded-pill py-3 fw-bold flex-grow-1 shadow-sm d-flex justify-content-center align-items-center" onClick={handleGenerateInvoice}>
              <FileText size={18} className="me-2"/> View Invoice
           </button>
           <button className="btn btn-success rounded-pill py-3 fw-bold flex-grow-1 shadow-sm d-flex justify-content-center align-items-center text-white" onClick={handleGenerateInvoice}>
              <ShoppingBag size={18} className="me-2"/> Generate Bill
           </button>
        </div>
      </div>

      {/* Generated Invoice Modal Overlay */}
      {showInvoice && invoiceData && (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-3 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center py-4 px-3 p-md-5 overflow-auto">
           <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="bg-white rounded-4 shadow-lg position-relative d-flex flex-column" style={{ width: "100%", maxWidth: "600px", minHeight: "500px" }}>
              
              {/* Desktop Print styling */}
              <style dangerouslySetInnerHTML={{__html: `
                @media print {
                  body * { visibility: hidden; }
                  #invoice-print-area, #invoice-print-area * { visibility: visible; }
                  #invoice-print-area { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; }
                  .no-print { display: none !important; }
                }
              `}} />

              {/* Close Button */}
              <button className="btn btn-white border rounded-circle p-2 position-absolute shadow-sm" style={{ top: "-15px", right: "-15px", zIndex: 1000 }} onClick={closeInvoice}>
                 <X size={20} />
              </button>

              <div id="invoice-print-area" className="p-4 p-md-5 bg-white rounded-4 flex-grow-1">
                 {/* Invoice Header */}
                 <div className="text-center mb-5 pb-3 border-bottom">
                    <h2 className="fw-bolder mb-1 text-uppercase letter-spacing-1">{invoiceData.shopName}</h2>
                    <p className="text-muted small mb-0">TAX INVOICE</p>
                 </div>
                 
                 <div className="row mb-5">
                    <div className="col-6">
                       <p className="small text-muted mb-1 text-uppercase">Billed To:</p>
                       <h6 className="fw-bold mb-1">{invoiceData.customerName}</h6>
                       <p className="small text-muted mb-0">{invoiceData.whatsapp !== "N/A" ? `+91 ${invoiceData.whatsapp}` : ""}</p>
                    </div>
                    <div className="col-6 text-end">
                       <p className="small text-muted mb-1 text-uppercase">Invoice Details:</p>
                       <h6 className="fw-bold mb-1">{invoiceData.invoiceNo}</h6>
                       <p className="small text-muted mb-0">{invoiceData.date}</p>
                    </div>
                 </div>

                 {/* Invoice Items */}
                 <div className="table-responsive mb-4 border-bottom pb-4">
                    <table className="table table-borderless mb-0">
                       <thead>
                          <tr className="border-bottom">
                             <th className="py-2 px-0 text-muted small text-uppercase fw-semibold">Item</th>
                             <th className="py-2 text-center text-muted small text-uppercase fw-semibold">Qty</th>
                             <th className="py-2 text-end text-muted small text-uppercase fw-semibold">Price</th>
                             <th className="py-2 px-0 text-end text-muted small text-uppercase fw-semibold">Total</th>
                          </tr>
                       </thead>
                       <tbody>
                          {invoiceData.items.map((item, idx) => (
                             <tr key={idx}>
                                <td className="py-3 px-0 fw-medium">{item.product_name}</td>
                                <td className="py-3 text-center text-muted">{item.quantity}</td>
                                <td className="py-3 text-end text-muted">Rs. {parseFloat(item.price || 0).toFixed(2)}</td>
                                <td className="py-3 px-0 text-end fw-mono">Rs. {(item.quantity * item.price).toFixed(2)}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>

                 {/* Invoice Totals */}
                 <div className="d-flex justify-content-end mb-5">
                    <div style={{ width: "250px" }}>
                       <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Subtotal</span>
                          <span className="fw-mono">Rs. {invoiceData.subtotal.toFixed(2)}</span>
                       </div>
                       <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                          <span className="text-muted">GST (18%)</span>
                          <span className="fw-mono">Rs. {invoiceData.gst.toFixed(2)}</span>
                       </div>
                       <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-uppercase">Grand Total</span>
                          <span className="fs-4 fw-bolder fw-mono text-dark">Rs. {invoiceData.total.toFixed(2)}</span>
                       </div>
                    </div>
                 </div>

                 {/* Invoice Footer */}
                 <div className="text-center mt-5 pt-4">
                    <p className="text-muted small fst-italic mb-1">Generated by {invoiceData.billerName}</p>
                    <p className="text-muted small mb-0">Thank you for your business!</p>
                 </div>
              </div>

              {/* Action Buttons (Don't Print) */}
              <div className="bg-light p-4 border-top rounded-top-0 rounded-4 d-flex justify-content-end gap-3 no-print mt-auto">
                 <button className="btn btn-outline-secondary rounded-pill px-4 fw-medium flex-grow-1 flex-md-grow-0" onClick={closeInvoice}>Cancel</button>
                 <button className="btn btn-primary rounded-pill px-4 fw-bold flex-grow-1 flex-md-grow-0 d-flex align-items-center justify-content-center" onClick={() => window.print()}>
                    <Printer size={18} className="me-2" /> Print & Save
                 </button>
              </div>

           </motion.div>
        </div>
      )}
    </div>
  );
};

export default Billing;
