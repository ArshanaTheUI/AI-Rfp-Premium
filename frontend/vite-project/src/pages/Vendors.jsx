import { useEffect, useMemo, useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/pageCard.css";
import "../styles/button.css";

function getAvatarInitials(name) {
  return name
    .split(" ")
    .map((token) => token[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

function getRating(name) {
  return Math.min(5, Math.max(3.5, 4 + ((name.length % 5) - 2) * 0.3));
}

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({ name: "", contactEmail: "", contactPerson: "" });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadVendors = async () => {
    const res = await API.get("/vendors");
    setVendors(res.data);
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const filtered = useMemo(() => {
    return vendors.filter((vendor) =>
      vendor.name.toLowerCase().includes(search.toLowerCase()) ||
      vendor.contactEmail.toLowerCase().includes(search.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(search.toLowerCase())
    );
  }, [vendors, search]);

  const addVendor = async () => {
    if (!form.name || !form.contactEmail) {
      return alert("Name and email are required!");
    }

    try {
      await API.post("/vendors", form);
      setMessage("Vendor added successfully!");
      setForm({ name: "", contactEmail: "", contactPerson: "" });
      setModalOpen(false);
      loadVendors();
      const params = new URLSearchParams(window.location.search);
      const fromWizard = params.get("fromWizard");
      const nextStep = params.get("nextStep");
      if (fromWizard && nextStep) {
        navigate(`/wizard?step=${nextStep}`);
      }
    } catch (err) {
      alert("Error adding vendor");
    }
  };

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h2>Vendor Directory</h2>
          <p>Search vendors, review performance, and add new suppliers with ratings.</p>
        </div>
        <div className="page-actions">
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            Add Vendor
          </button>
        </div>
      </div>

      {message && (
        <div className="card-box" style={{ borderColor: "rgba(201,168,76,0.18)" }}>
          {message}
        </div>
      )}

      <div className="filter-panel">
        <input
          placeholder="Search vendors by name, email, or contact person"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="badge-pill">{filtered.length} vendors found</span>
      </div>

      <div className="card-box">
        {filtered.length === 0 ? (
          <p>No vendors match your search.</p>
        ) : (
          <div className="vendor-table">
            {filtered.map((vendor) => {
              const rating = getRating(vendor.name || vendor.contactPerson || "Vendor");
              return (
                <div key={vendor._id} className="vendor-row">
                  <div className="vendor-profile">
                    <div className="avatar">{getAvatarInitials(vendor.name || vendor.contactPerson || "VN")}</div>
                    <div>
                      <strong>{vendor.name}</strong>
                      <p>{vendor.contactPerson || "Contact unknown"}</p>
                    </div>
                  </div>
                  <div>
                    <p>{vendor.contactEmail}</p>
                  </div>
                  <div className="star-rating">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index}>{index < Math.round(rating) ? "★" : "☆"}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-window">
            <div className="modal-header">
              <div>
                <h3>Add New Vendor</h3>
                <p>Keep your supplier roster up to date.</p>
              </div>
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>
            <label>Vendor Name</label>
            <input
              placeholder="Vendor Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <label>Vendor Email</label>
            <input
              placeholder="Vendor Email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            />
            <label>Contact Person</label>
            <input
              placeholder="Contact Person Name"
              value={form.contactPerson}
              onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            />
            <div className="page-actions" style={{ justifyContent: "flex-end" }}>
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={addVendor}>
                Save Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
