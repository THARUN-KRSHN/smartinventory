import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import { Users, UserPlus, Trash2, Edit2, ShieldAlert, FileUp, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";

const getRole = () => {
  const role = localStorage.getItem("role") || localStorage.getItem("userRole");
  return role ? role.toLowerCase() : null;
};

const StaffManagement = () => {
  const navigate = useNavigate();

  // Staff Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // List State
  const [staffList, setStaffList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  // Action State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // EDIT State
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Selection State
  const [selectedStaff, setSelectedStaff] = useState([]);

  useEffect(() => {
    if (getRole() !== "admin") {
      navigate("/billing", { replace: true });
      return;
    }

    let isMounted = true;
    const fetchStaff = async () => {
      setIsLoadingList(true);
      try {
        // Assuming API is GET /auth/staff
        const data = await apiRequest({ method: "GET", url: "/auth/staff" });
        const staffArray = Array.isArray(data) ? data : data?.staff || [];
        if (isMounted) setStaffList(staffArray);
      } catch (_error) {
        if (isMounted) setErrorMessage("Could not load existing staff list.");
      } finally {
        if (isMounted) setIsLoadingList(false);
      }
    };

    fetchStaff();
    return () => { isMounted = false; };
  }, [navigate]);

  const showFeedback = (msg, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setSuccessMessage("");
    } else {
      setSuccessMessage(msg);
      setErrorMessage("");
    }
    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 4000);
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await apiRequest({
        method: "POST",
        url: "/auth/staff",
        data: { email, password, full_name: fullName },
      });
      const createdStaff = data?.staff || data?.user || data;
      if (createdStaff?.email) {
        setStaffList((prev) => [createdStaff, ...prev]);
      }
      setFullName(""); setEmail(""); setPassword("");
      showFeedback("Staff account created successfully.");
    } catch (error) {
      showFeedback("Unable to add staff member.", true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      // Assuming PUT /auth/staff/{id} or similar
      const data = await apiRequest({
        method: "PUT",
        url: `/auth/staff/${editingId}`,
        data: { email, password: password || undefined, full_name: fullName },
      });

      const updatedStaff = data?.staff || data?.user || data;
      setStaffList((prev) => prev.map(s => ((s.user_id || s.id) === editingId ? { ...s, ...updatedStaff, full_name: fullName, email: email } : s)));

      setShowEditModal(false);
      setFullName(""); setEmail(""); setPassword("");
      setEditingId(null);
      showFeedback("Staff account updated successfully.");
    } catch (error) {
      // Fallback: update list locally if endpoint fails during dev mockup
      setStaffList((prev) => prev.map(s => ((s.user_id || s.id) === editingId ? { ...s, full_name: fullName, email: email } : s)));
      setShowEditModal(false);
      setFullName(""); setEmail(""); setPassword("");
      setEditingId(null);
      showFeedback("Changes saved locally! (API PUT endpoint might not exist)");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (staff) => {
    setEditingId(staff.user_id || staff.id);
    setFullName(staff.full_name || staff.name || "");
    setEmail(staff.email || "");
    setPassword(""); // Ensure password field is empty for editing
    setShowEditModal(true);
  };

  const handleDelete = async (staffId) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) return;
    try {
      await apiRequest({
        method: "DELETE",
        // Adjust according to your real URL, e.g. /auth/staff/{id}
        url: `/auth/staff/${staffId}`,
      });
      setStaffList((prev) => prev.filter(s => (s.user_id || s.id) !== staffId));
      showFeedback("Staff removed.");
    } catch (e) {
      // Mock fallback
      setStaffList((prev) => prev.filter(s => (s.user_id || s.id) !== staffId));
      showFeedback("Staff removed locally. (API DELETE endpoint might not exist)");
    }
  };

  const toggleSelectAll = () => {
    if (selectedStaff.length === staffList.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(staffList.map(s => s.user_id || s.id));
    }
  };

  const toggleSelectStaff = (id) => {
    if (selectedStaff.includes(id)) {
      setSelectedStaff(prev => prev.filter(s => s !== id));
    } else {
      setSelectedStaff(prev => [...prev, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to remove ${selectedStaff.length} staff members?`)) return;
    try {
      await apiRequest({
        method: "POST",
        url: "/auth/staff/bulk-delete",
        data: { user_ids: selectedStaff }
      });
      setStaffList(prev => prev.filter(s => !selectedStaff.includes(s.user_id || s.id)));
      setSelectedStaff([]);
      showFeedback(`Successfully removed ${selectedStaff.length} staff members.`);
    } catch (e) {
      // Mock fallback
      setStaffList(prev => prev.filter(s => !selectedStaff.includes(s.user_id || s.id)));
      setSelectedStaff([]);
      showFeedback("Staff removed locally. (API endpoint failed)");
    }
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,full_name,email,password\nJohn Doe,john@example.com,securepass123\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "staff_template.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsSubmitting(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const payload = results.data.map(row => ({
          full_name: row.full_name,
          email: row.email,
          password: row.password,
        })).filter(item => item.full_name && item.email && item.password);

        if (payload.length === 0) {
          showFeedback("No valid staff members found in CSV. Check template.", true);
          setIsSubmitting(false);
          return;
        }

        try {
          const resp = await apiRequest({
            method: "POST",
            url: "/auth/staff/bulk",
            data: payload,
          });
          const newStaff = Array.isArray(resp) ? resp : [];
          setStaffList(prev => [...newStaff, ...prev]);
          showFeedback("Staff members imported successfully!");
        } catch (err) {
          showFeedback(err.response?.data?.detail || "Failed to import staff.", true);
        } finally {
          setIsSubmitting(false);
          e.target.value = null;
        }
      },
      error: () => {
        showFeedback("Error parsing CSV file.", true);
        setIsSubmitting(false);
      }
    });
  };

  return (
    <div className="d-flex flex-column h-100">

      <div className="mb-4">
        <h2 className="display-6 fw-bold mb-0" style={{ letterSpacing: "-1px" }}>Staff Management</h2>
        <p className="text-secondary mt-1">Add and organize your team members.</p>
      </div>

      <AnimatePresence>
        {errorMessage && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="alert alert-danger shadow-sm border-0 rounded-4 py-2">{errorMessage}</motion.div>}
        {successMessage && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="alert alert-success shadow-sm border-0 rounded-4 py-2">{successMessage}</motion.div>}
      </AnimatePresence>

      <div className="row g-4 flex-grow-1">

        {/* ADD FORM */}
        <div className="col-12 col-xl-4">
          <div className="card shadow-sm border-0 rounded-4 bg-white mb-4 mb-xl-0">
            <div className="card-body p-4 p-md-5 d-flex flex-column">
              <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
                <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                  <UserPlus size={20} className="text-primary" />
                </div>
                <h5 className="fw-bold mb-0">Add New Staff</h5>
              </div>

              <form onSubmit={handleCreateSubmit} className="d-flex flex-column">
                <div className="mb-3">
                  <label className="form-label text-secondary fw-semibold small text-uppercase">Full Name</label>
                  <input type="text" className="form-control form-control-lg bg-light border-0" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isSubmitting} />
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary fw-semibold small text-uppercase">Email Address</label>
                  <input type="email" className="form-control form-control-lg bg-light border-0" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary fw-semibold small text-uppercase">Password</label>
                  <input type="password" className="form-control form-control-lg bg-light border-0" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isSubmitting} />
                </div>
                <button type="submit" className="btn shadow-sm btn-lg w-100 rounded-pill fw-semibold mt-2" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Create Staff Account"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* STAFF LIST */}
        <div className="col-12 col-xl-8 h-100">
          <div className="card shadow-sm border-0 rounded-4 h-100 bg-white">
            <div className="card-body p-0 d-flex flex-column h-100 overflow-hidden">
              <div className="p-4 p-md-5 pb-3 d-flex align-items-center justify-content-between border-bottom flex-wrap gap-3">
                <div className="d-flex align-items-center">
                  <input type="checkbox" className="form-check-input me-3" style={{transform: "scale(1.3)", cursor: "pointer"}} checked={staffList.length > 0 && selectedStaff.length === staffList.length} onChange={toggleSelectAll} disabled={staffList.length === 0} />
                  <h5 className="fw-bold mb-0 d-flex align-items-center"><Users size={20} className="text-secondary me-2" /> Staff Members</h5>
                  <span className="badge bg-light text-dark border px-3 py-2 rounded-pill ms-3">{staffList.length}</span>
                </div>
                <div className="d-flex gap-2 text-nowrap">
                  {selectedStaff.length > 0 && (
                     <button type="button" className="btn btn-sm btn-danger rounded-pill px-3 shadow-sm d-flex align-items-center" onClick={handleBulkDelete}>
                       <Trash2 size={14} className="me-2" /> Delete ({selectedStaff.length})
                     </button>
                  )}
                  <button type="button" className="btn btn-sm btn-light border rounded-pill px-3 fw-medium shadow-sm d-flex align-items-center" onClick={downloadTemplate}>
                    <Download size={14} className="me-2" /> Template
                  </button>
                  <label className="btn btn-sm btn-light border rounded-pill px-3 fw-medium shadow-sm d-flex align-items-center mb-0" style={{ cursor: "pointer" }}>
                    <FileUp size={14} className="me-2 text-primary" /> {isSubmitting ? "..." : "Import CSV"}
                    <input type="file" accept=".csv" className="d-none" onChange={handleFileUpload} disabled={isSubmitting} />
                  </label>
                </div>
              </div>

              <div className="flex-grow-1 overflow-auto p-3 p-md-5 pt-3">
                {isLoadingList ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="spinner-border text-primary speed-fast" role="status" />
                  </div>
                ) : staffList.length === 0 ? (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                    <ShieldAlert size={48} className="mb-3 opacity-25" />
                    <h6>No staff members found</h6>
                    <p className="small">Use the panel on the left to add your first staff member.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {staffList.map((staff, idx) => {
                      const id = staff.user_id || staff.id || idx;
                      return (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} key={id} className={`d-flex flex-wrap align-items-center justify-content-between p-3 border rounded-4 gap-3 ${selectedStaff.includes(id) ? "bg-primary bg-opacity-10 border-primary" : "bg-light bg-opacity-50"}`}>
                        <div className="d-flex align-items-center flex-grow-1">
                          <input type="checkbox" className="form-check-input me-3 flex-shrink-0" style={{transform: "scale(1.2)", cursor: "pointer"}} checked={selectedStaff.includes(id)} onChange={() => toggleSelectStaff(id)} />
                          <div className="bg-white rounded-circle d-flex align-items-center justify-content-center border shadow-sm me-3 flex-shrink-0" style={{ width: "48px", height: "48px" }}>
                            <span className="fw-bold fs-5 text-primary">{(staff.full_name || staff.name || staff.email || "S")[0].toUpperCase()}</span>
                          </div>
                          <div className="overflow-hidden">
                            <h6 className="mb-1 fw-bold text-truncate">{staff.full_name || staff.name || "-"}</h6>
                            <div className="text-muted small px-2 py-1 bg-white rounded-pill d-inline-block border text-truncate max-w-100">{staff.email}</div>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-white shadow-sm border rounded-circle p-2 text-primary" onClick={() => openEditModal(staff)}><Edit2 size={16} /></button>
                          <button className="btn btn-white border shadow-sm rounded-circle p-2 text-danger" onClick={() => handleDelete(id)}><Trash2 size={16} /></button>
                        </div>
                      </motion.div>
                    );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {showEditModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="position-fixed top-0 start-0 w-100 h-100 bg-dark z-3" onClick={() => !isSubmitting && setShowEditModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="position-fixed top-50 start-50 translate-middle z-3 w-100 px-3" style={{ maxWidth: "500px" }}>
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <form onSubmit={handleEditSubmit}>
                  <div className="card-header bg-white border-bottom-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">Edit Staff Member</h5>
                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} disabled={isSubmitting} />
                  </div>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <label className="form-label text-secondary fw-semibold small text-uppercase">Full Name</label>
                      <input type="text" className="form-control bg-light border-0 py-2 px-3" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isSubmitting} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-secondary fw-semibold small text-uppercase">Email</label>
                      <input type="email" className="form-control bg-light border-0 py-2 px-3" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-secondary fw-semibold small text-uppercase">New Password (Optional)</label>
                      <input type="password" placeholder="Leave blank to keep existing password" className="form-control bg-light border-0 py-2 px-3" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isSubmitting} />
                    </div>
                  </div>
                  <div className="card-footer bg-light border-top-0 p-4 pt-3 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowEditModal(false)} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" className="btn rounded-pill px-4 shadow-sm" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update Staff"}
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

export default StaffManagement;