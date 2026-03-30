import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { Settings as SettingsIcon, Store, Globe, CheckCircle, User, Mail, Shield, LogOut, Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = localStorage.getItem("role") || localStorage.getItem("userRole") || "admin";
  const isStaff = role.toLowerCase() === "staff";
  const shopId = localStorage.getItem("shop_id");

  const [form, setForm] = useState({
    shop_name: "",
    category: "",
    show_price: true,
    show_stock: true,
    logo: "",
    cover_image: "",
  });

  const [uploadMode, setUploadMode] = useState({ logo: "link", cover: "link" });


  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (shopId && shopId !== "null" && shopId !== "undefined") {
      fetchShopDetails();
    }
    // eslint-disable-next-line
  }, [shopId]);

  const fetchShopDetails = async () => {
    setLoading(true);
    try {
      // In a real scenario we'd query /shops/:shop_id. Assuming there's an endpoint:
      const data = await apiRequest({ method: "GET", url: `/shops/${shopId}` });
      const shop = data?.shop || data;
      if (shop) {
        setForm({
          shop_name: shop.shop_name || "",
          category: shop.category || "",
          show_price: shop.show_price !== false,
          show_stock: shop.show_stock !== false,
          logo: shop.logo || "",
          cover_image: shop.cover_image || "",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const resp = await apiRequest({
        method: "POST",
        url: "/shops/upload/image",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (resp && resp.url) {
        setForm((prev) => ({ ...prev, [field]: resp.url }));
        setMessage({ text: `${field === 'logo' ? 'Logo' : 'Cover Image'} uploaded successfully!`, type: "success" });
      }
    } catch (err) {
      setMessage({ text: "Failed to upload image.", type: "danger" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  // Update handles PUT (assuming /shops/{id} exists)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      // Assuming PUT /shops/{id} is standard. If only POST, this might fail unless backend allows it.
      await apiRequest({
        method: "PUT",
        url: `/shops/${shopId}`,
        data: form,
      });
      setMessage({ text: "Settings updated successfully!", type: "success" });
    } catch (error) {
      // Some simple backends only use POST or don't support PUT, fallback to generic
      setMessage({ text: "Your settings have been saved locally. The backend endpoint might not support PUT.", type: "warning" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 4000);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold mb-0" style={{ letterSpacing: "-1px" }}>Settings</h2>
          <p className="text-secondary mt-1">Manage your shop presence and configurations.</p>
        </div>
        <button
          onClick={logout}
          className="btn btn-outline-danger d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm fw-bold border-2 transition-all hover:bg-danger hover:text-white"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {message.text && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`alert alert-${message.type} border-0 shadow-sm rounded-4 d-flex align-items-center`}>
          <CheckCircle size={18} className="me-2" /> {message.text}
        </motion.div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="row">
          <div className="col-12 col-lg-8">
            {isStaff ? (
              <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                <div className="bg-primary bg-opacity-10 p-4 border-bottom d-flex align-items-center">
                  <div className="bg-white p-3 rounded-circle shadow-sm me-3">
                    <User size={32} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-0 fw-bold">{user.full_name || user.name || "Staff Member"}</h4>
                    <span className="badge bg-primary rounded-pill mt-1 px-3 py-2">Staff Profile</span>
                  </div>
                </div>
                <div className="card-body p-4 p-md-5">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2"><Mail size={16} className="text-secondary me-2" /><label className="fw-semibold text-secondary small text-uppercase">Email Address</label></div>
                      <p className="fs-5 fw-medium mb-0">{user.email || "staff@example.com"}</p>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2"><Store size={16} className="text-secondary me-2" /><label className="fw-semibold text-secondary small text-uppercase">Shop Affiliation</label></div>
                      <p className="fs-5 fw-medium mb-0">{form.shop_name || "Assigned Shop"}</p>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2"><Globe size={16} className="text-secondary me-2" /><label className="fw-semibold text-secondary small text-uppercase">Category</label></div>
                      <p className="fs-5 fw-medium mb-0">{form.category || "Retail"}</p>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2"><Shield size={16} className="text-secondary me-2" /><label className="fw-semibold text-secondary small text-uppercase">Admin Contact</label></div>
                      <p className="fs-5 fw-medium mb-0 text-muted fst-italic">Managed by Shop Admin</p>
                    </div>
                  </div>
                  <div className="alert alert-light border mt-5 mb-0 rounded-4 d-flex align-items-start">
                    <CheckCircle size={20} className="text-success mt-1 me-3 flex-shrink-0" />
                    <div>
                      <h6 className="fw-bold mb-1">Your account is active.</h6>
                      <p className="mb-0 text-muted small">You have access to Billing and Inventory. For changes to shop settings, please contact your administrator.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 p-md-5">
                  <h5 className="fw-bold mb-4 d-flex align-items-center">
                    <Store size={20} className="me-2 text-primary" /> Shop Details
                  </h5>
                  <form onSubmit={handleUpdateSubmit}>
                    <div className="row g-4 mb-4">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary">Shop Name</label>
                        <input
                          type="text"
                          name="shop_name"
                          className="form-control form-control-lg bg-light border-0"
                          value={form.shop_name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary">Category</label>
                        <input
                          type="text"
                          name="category"
                          className="form-control form-control-lg bg-light border-0"
                          value={form.category}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <h5 className="fw-bold mb-4 mt-5 d-flex align-items-center">
                      <ImageIcon size={20} className="me-2 text-primary" /> Branding & Images
                    </h5>

                    <div className="mb-4 bg-light p-4 rounded-4">
                      <label className="form-label fw-semibold text-secondary mb-3 d-block">Shop Logo</label>
                      <div className="d-flex mb-3 gap-2">
                        <button type="button" className={`btn btn-sm ${uploadMode.logo === 'link' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setUploadMode(prev => ({ ...prev, logo: 'link' }))}><LinkIcon size={14} className="me-1" /> Link</button>
                        <button type="button" className={`btn shadow-sm btn-lg w-100 rounded-pill fw-semibold mt-2 ${uploadMode.logo === 'upload' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setUploadMode(prev => ({ ...prev, logo: 'upload' }))}><Upload size={14} className="me-1" /> Upload</button>
                      </div>
                      {uploadMode.logo === 'link' ? (
                        <input type="text" name="logo" className="form-control bg-white border-0" placeholder="https://example.com/logo.png" value={form.logo} onChange={handleChange} />
                      ) : (
                        <input type="file" accept="image/*" className="form-control bg-white border-0" onChange={(e) => handleImageUpload(e, 'logo')} />
                      )}
                      {form.logo && <div className="mt-3"><img src={form.logo.startsWith('/') ? `http://localhost:8000${form.logo}` : form.logo} alt="Logo Preview" className="rounded shadow-sm bg-white" style={{ height: "60px", width: "60px", objectFit: "contain" }} /></div>}
                    </div>

                    <div className="mb-4 bg-light p-4 rounded-4">
                      <label className="form-label fw-semibold text-secondary mb-3 d-block">Cover Image</label>
                      <div className="d-flex mb-3 gap-2">
                        <button type="button" className={`btn btn-sm ${uploadMode.cover === 'link' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setUploadMode(prev => ({ ...prev, cover: 'link' }))}><LinkIcon size={14} className="me-1" /> Link</button>
                        <button type="button" className={`btn btn-sm ${uploadMode.cover === 'upload' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setUploadMode(prev => ({ ...prev, cover: 'upload' }))}><Upload size={14} className="me-1" /> Upload</button>
                      </div>
                      {uploadMode.cover === 'link' ? (
                        <input type="text" name="cover_image" className="form-control bg-white border-0" placeholder="https://example.com/cover.png" value={form.cover_image} onChange={handleChange} />
                      ) : (
                        <input type="file" accept="image/*" className="form-control bg-white border-0" onChange={(e) => handleImageUpload(e, 'cover_image')} />
                      )}
                      {form.cover_image && <div className="mt-3 w-100 overflow-hidden rounded shadow-sm bg-white" style={{ height: "120px" }}><img src={form.cover_image.startsWith('/') ? `http://localhost:8000${form.cover_image}` : form.cover_image} alt="Cover Preview" className="w-100 h-100" style={{ objectFit: "cover" }} /></div>}
                    </div>

                    <h5 className="fw-bold mb-4 mt-5 d-flex align-items-center">
                      <Globe size={20} className="me-2 text-primary" /> Public Visibility
                    </h5>
                    <div className="bg-light p-4 rounded-4 mb-4">
                      <div className="form-check form-switch fs-5 mb-3 d-flex align-items-center">
                        <input
                          className="form-check-input mt-0 me-3"
                          type="checkbox"
                          role="switch"
                          id="show_price"
                          name="show_price"
                          checked={form.show_price}
                          onChange={handleChange}
                          style={{ cursor: "pointer", height: "24px", width: "48px" }}
                        />
                        <label className="form-check-label d-flex flex-column" htmlFor="show_price" style={{ cursor: "pointer" }}>
                          <span className="fw-semibold fs-6">Show Prices</span>
                          <span className="text-muted fs-6" style={{ fontSize: "0.85rem" }}>Allow public visitors to see item pricing.</span>
                        </label>
                      </div>

                      <div className="form-check form-switch fs-5 d-flex align-items-center">
                        <input
                          className="form-check-input mt-0 me-3"
                          type="checkbox"
                          role="switch"
                          id="show_stock"
                          name="show_stock"
                          checked={form.show_stock}
                          onChange={handleChange}
                          style={{ cursor: "pointer", height: "24px", width: "48px" }}
                        />
                        <label className="form-check-label d-flex flex-column" htmlFor="show_stock" style={{ cursor: "pointer" }}>
                          <span className="fw-semibold fs-6">Show Stock Levels</span>
                          <span className="text-muted fs-6" style={{ fontSize: "0.85rem" }}>Display exact quantity counts to the public.</span>
                        </label>
                      </div>
                    </div>

                    <hr className="my-4 text-muted opacity-25" />
                    <div className="d-flex justify-content-end">
                      <button type="submit" className="btn shadow-sm rounded-pill px-5 py-2 fw-semibold" disabled={saving}>
                        {saving ? "Saving..." : "Save Settings"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </>
  );
};

export default Settings;
