import { useEffect, useMemo, useState } from "react";
import { API } from "../api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/pagecard.css";
import "../styles/button.css";
import "../styles/RfpList.css";

export default function RfpList() {
  const [rfps, setRfps] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const loadRfps = async () => {
    const res = await API.get("/rfps");
    setRfps(res.data);
  };

  useEffect(() => {
    loadRfps();
  }, []);

  const filtered = useMemo(() => {
    return rfps.filter((rfp) =>
      (rfp.title || "Untitled").toLowerCase().includes(search.toLowerCase())
    );
  }, [rfps, search]);

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h2>RFP Management</h2>
          <p>Filter your open requests and jump directly into the AI workflow.</p>
        </div>
        <div className="page-actions">
          <button className="btn-secondary" onClick={() => navigate("/create-rfp")}>New RFP</button>
          <Link to="/create-rfp" className="btn-primary">AI Create</Link>
        </div>
      </div>

      <div className="filter-panel">
        <input
          placeholder="Search RFPs by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="badge-pill">{filtered.length} results</span>
      </div>

      {filtered.length === 0 ? (
        <div className="card-box">
          <p>No RFPs found. Create one to start your procurement flow.</p>
        </div>
      ) : (
        <div className="rfp-grid">
          {filtered.map((r) => (
            <div key={r._id} className="rfp-card">
              <div className="card-top">
                <span className="badge-pill">{new Date(r.createdAt).toLocaleDateString()}</span>
                <span className="status-pill">Open</span>
              </div>
              <h3>{r.title || "Untitled RFP"}</h3>
              <p>{r.summary || "AI structured request ready for vendor outreach."}</p>
              <div className="rfp-card-footer">
                <Link to={`/rfp/${r._id}`} className="btn-secondary">
                  View Details
                </Link>
                <Link to={`/rfp/${r._id}/compare`} className="btn-primary">
                  Compare
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
