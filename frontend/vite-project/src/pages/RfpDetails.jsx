import { useEffect, useState } from "react";
import { API } from "../api";
import { useParams, Link } from "react-router-dom";
import "../styles/pageCard.css";
import "../styles/button.css";
import "../styles/RfpDetails.css";

function formatNumber(v) {
  if (v == null) return "-";
  if (typeof v === "number") return v.toLocaleString();
  return v;
}

export default function RfpDetails() {
  const { id } = useParams();
  const [rfp, setRfp] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const loadData = async () => {
    const res = await API.get(`/rfps/${id}/details`);
    setRfp(res.data.rfp);
    setProposals(res.data.proposals);
    setSelectedProposal(res.data.proposals?.[0] ?? null);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!rfp) return <p className="loading">Loading...</p>;

  const proposalCards = proposals.map((p) => {
    const score = p._score ?? 0;
    return (
      <button
        key={p._id}
        className={`proposal-item ${selectedProposal?._id === p._id ? "active" : ""}`}
        onClick={() => setSelectedProposal(p)}
      >
        <div>
          <strong>{p.vendor?.name || "Unknown Vendor"}</strong>
          <p>{p.vendor?.contactEmail || "No email"}</p>
        </div>
        <div className="score-pill">{score.toFixed ? score.toFixed(1) : score}</div>
      </button>
    );
  });

  const selected = selectedProposal || proposals[0];
  const selectedStructured = selected?.structured || {};
  const total = selectedStructured.total_price || selectedStructured.price || "-";

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h2>Proposals Inbox</h2>
          <p>Review vendor responses, analyze scores, and compare details side by side.</p>
        </div>
        <div className="page-actions">
          <Link to={`/rfp/${id}/compare`} className="btn-primary">Compare Proposals</Link>
        </div>
      </div>

      <div className="details-split">
        <aside className="proposal-list">
          <div className="card-box">
            <div className="section-header">
              <h4>Vendor proposals</h4>
              <p>Select a proposal to view the full analysis.</p>
            </div>
            {proposalCards.length === 0 ? (
              <p>No proposals received yet.</p>
            ) : (
              <div className="proposal-list-grid">{proposalCards}</div>
            )}
          </div>
        </aside>

        <div className="proposal-detail">
          <div className="card-box">
            <div className="section-header">
              <div>
                <h3>{selected?.vendor?.name || "Proposal details"}</h3>
                <p>{selected?.vendor?.contactEmail || "Vendor contact information"}</p>
              </div>
              <span className="status-pill">Score {selected?._score?.toFixed(1) ?? "0.0"}</span>
            </div>

            <div className="detail-grid">
              <div className="detail-metric">
                <span className="muted-label">Total</span>
                <strong>{formatNumber(total)}</strong>
              </div>
              <div className="detail-metric">
                <span className="muted-label">Delivery</span>
                <strong>{selectedStructured.delivery_days || selectedStructured.delivery || "-"}</strong>
              </div>
              <div className="detail-metric">
                <span className="muted-label">Warranty</span>
                <strong>{selectedStructured.warranty_months || selectedStructured.warranty || "-"}</strong>
              </div>
            </div>

            <div className="score-bar">
              <div className="score-fill" style={{ width: `${Math.min(100, (selected?._score ?? 0) * 10)}%` }} />
            </div>

            <div className="json-card">
              <pre className="mono">{JSON.stringify(selectedStructured, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
