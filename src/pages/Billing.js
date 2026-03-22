import React, { useState, useEffect } from "react";
import { apiRequest } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, User, Phone, Receipt, FileText, Printer, X, ShoppingBag, Search, Package } from "lucide-react";

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Draft Invoice State
  const [customerName, setCustomerName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [orderItems, setOrderItems] = useState([
    { id: Date.now(), product_id: "", product_name: "", quantity: 1, price: 0 }
  ]);

  // Invoice view state
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDraftPreview, setIsDraftPreview] = useState(false);

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

  const filteredProducts = products.filter(p => (p.product_name || "").toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddFromCard = (product) => {
    const existingItem = orderItems.find(item => item.product_id === (product.product_id ?? product.id));
    if (existingItem) {
      handleItemChange(existingItem.id, "quantity", parseInt(existingItem.quantity) + 1);
    } else {
      const emptyRow = orderItems.find(item => item.product_id === "" && item.product_name === "");
      if (emptyRow) {
        setOrderItems(orderItems.map(item => {
          if (item.id === emptyRow.id) {
            return { ...item, product_id: product.product_id ?? product.id, product_name: product.product_name, price: product.price, quantity: 1 };
          }
          return item;
        }));
      } else {
        setOrderItems([...orderItems, { 
          id: Date.now(), 
          product_id: product.product_id ?? product.id, 
          product_name: product.product_name, 
          quantity: 1, 
          price: product.price 
        }]);
      }
    }
  };

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

  const handleViewInvoice = () => {
    const validItems = orderItems.filter(item => item.product_name.trim() !== "");
    if (validItems.length === 0) {
      alert("Please add at least one item to preview the invoice.");
      return;
    }
    setInvoiceData({
      invoiceNo: "DRAFT",
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
    setIsDraftPreview(true);
    setShowInvoice(true);
  };

  const handleGenerateInvoice = async () => {
    // Validate
    const validItems = orderItems.filter(item => item.product_name.trim() !== "" && item.quantity > 0 && item.product_id);
    if (validItems.length === 0) {
      alert("Please add at least one valid inventory item with a product ID to generate a bill.");
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        items: validItems.map((item) => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity)
        }))
      };
      
      const response = await apiRequest({ method: "POST", url: "/sales/", data: payload });

      setInvoiceData({
        invoiceNo: response.sale_id ? `INV-${response.sale_id.toString().padStart(6, '0')}` : `INV-${Math.floor(100000 + Math.random() * 900000)}`,
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

      setIsDraftPreview(false);
      setShowInvoice(true);
      clearDraft();
    } catch (error) {
      alert(error?.response?.data?.detail || "Failed to generate invoice. Please check stock levels and try again.");
    } finally {
      setIsGenerating(false);
    }
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
      
      {/* LEFT COLUMN: Product Grid Menu */}
      <div className="col-12 col-xl-7 d-none d-xl-flex flex-column h-100 bg-light p-4 pt-5 border-end">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <h3 className="fw-bolder m-0 text-dark">Menu</h3>
            <p className="text-muted small mb-0">Select products to add to bill</p>
          </div>
          <div className="position-relative" style={{width: '300px'}}>
            <Search size={18} className="position-absolute text-muted" style={{top: '10px', left: '15px'}} />
            <input type="text" className="form-control rounded-pill ps-5 pe-3 py-2 shadow-sm border-0" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        
        <div className="row g-3 overflow-auto pb-4 align-content-start flex-grow-1" style={{minHeight: 0}}>
           {filteredProducts.map(p => (
              <div key={p.product_id ?? p.id} className="col-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="card h-100 border-0 shadow-sm rounded-4 cursor-pointer" onClick={() => handleAddFromCard(p)} style={{cursor: 'pointer'}}>
                   <div className="card-body d-flex flex-column h-100 p-3">
                     <h6 className="fw-bold text-dark mb-1 text-truncate" title={p.product_name}>{p.product_name}</h6>
                     <div className="mt-auto d-flex justify-content-between align-items-center mt-3">
                       <span className="text-primary fw-bolder">₹{parseFloat(p.price).toFixed(2)}</span>
                       <span className={`badge ${p.quantity > p.threshold ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'} rounded-pill small`}>{p.quantity} in stock</span>
                     </div>
                   </div>
                </motion.div>
              </div>
           ))}
           {filteredProducts.length === 0 && !loading && (
              <div className="col-12 text-center text-muted py-5 mt-5">
                 <Package size={40} className="mb-3 opacity-50" />
                 <h5>No products found</h5>
                 <p className="small">Try adjusting your search criteria.</p>
              </div>
           )}
           {loading && (
             <div className="col-12 text-center text-muted py-5 mt-5">
                <span className="spinner-border spinner-border-sm text-primary mb-3" />
                <p>Loading catalog...</p>
             </div>
           )}
        </div>
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
           
           <div className="row g-3 mb-4">
             <div className="col-6">
                <label className="form-label small text-muted fst-italic mb-1">Customer Name</label>
                <div className="input-group overflow-hidden rounded-3 border">
                   <span className="input-group-text bg-white border-0 pe-1"><User size={16} className="text-muted" /></span>
                   <input type="text" className="form-control bg-white border-0 py-2 ps-2 shadow-none" placeholder="Name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                </div>
             </div>
             <div className="col-6">
                <label className="form-label small text-muted fst-italic mb-1">WhatsApp #</label>
                <div className="input-group overflow-hidden rounded-3 border">
                   <span className="input-group-text bg-white border-0 pe-1"><Phone size={16} className="text-muted" /></span>
                   <input type="text" className="form-control bg-white border-0 py-2 ps-2 shadow-none" placeholder="Number" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
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
                     <div className="col-5">
                        {loading ? (
                           <input type="text" className="form-control bg-white border rounded-3 py-2 px-3 shadow-none" placeholder="Loading products..." disabled />
                        ) : (
                           <input 
                             className="form-control bg-white border rounded-3 py-2 px-3 shadow-none fw-medium" 
                             placeholder="Product Name" 
                             value={item.product_name} 
                             onChange={(e) => {
                               handleItemChange(item.id, "product_name", e.target.value);
                               const selected = products.find(p => p.product_name === e.target.value);
                               if (selected) {
                                 handleItemChange(item.id, "product_id", selected.product_id ?? selected.id);
                               }
                             }} 
                           />
                        )}
                     </div>
                     <div className="col-3">
                        <div className="d-flex align-items-center bg-white border rounded-3 overflow-hidden">
                           <button className="btn btn-light border-0 px-2 py-1 text-muted" onClick={() => handleItemChange(item.id, "quantity", Math.max(1, (parseInt(item.quantity) || 1) - 1))}><Minus size={14}/></button>
                           <input type="text" className="form-control border-0 px-1 py-1 text-center shadow-none fw-mono text-dark" value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", e.target.value.replace(/[^0-9]/g, ''))} style={{WebkitAppearance: 'none', MozAppearance: 'textfield'}} />
                           <button className="btn btn-light border-0 px-2 py-1 text-muted" onClick={() => handleItemChange(item.id, "quantity", (parseInt(item.quantity) || 0) + 1)}><Plus size={14}/></button>
                        </div>
                     </div>
                     <div className="col-3">
                        <input type="number" min="0" step="0.01" className="form-control bg-white border rounded-3 py-2 px-2 text-center shadow-none fw-mono" placeholder="₹" value={item.price} onChange={(e) => handleItemChange(item.id, "price", e.target.value)} />
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
           <button className="btn btn-dark rounded-pill py-3 fw-bold flex-grow-1 shadow-sm d-flex justify-content-center align-items-center" onClick={handleViewInvoice} disabled={isGenerating}>
              <FileText size={18} className="me-2"/> View Invoice
           </button>
           <button className="btn btn-success rounded-pill py-3 fw-bold flex-grow-1 shadow-sm d-flex justify-content-center align-items-center text-white" onClick={handleGenerateInvoice} disabled={isGenerating}>
              {isGenerating ? <span className="spinner-border spinner-border-sm me-2" /> : <ShoppingBag size={18} className="me-2"/>} {isGenerating ? "Processing..." : "Generate Bill"}
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
                 <div className="text-center mb-5 pb-3 border-bottom position-relative">
                    {isDraftPreview && (
                       <div className="position-absolute top-50 start-50 translate-middle" style={{transform: "translate(-50%, -50%) rotate(-15deg)", color: "rgba(0,0,0,0.05)", fontSize: "6rem", fontWeight: "900", pointerEvents: "none", whiteSpace: "nowrap"}}>
                          PREVIEW
                       </div>
                    )}
                    <h2 className="fw-bolder mb-1 text-uppercase letter-spacing-1">{invoiceData.shopName}</h2>
                    <p className="text-muted small mb-0">{isDraftPreview ? "DRAFT TAX INVOICE" : "TAX INVOICE"}</p>
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
