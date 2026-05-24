import { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/pageCard.css";
import "../styles/button.css";

export default function CreateRfp() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const createRfp = async (payload) => {
    const body = payload ?? { text };
    if (!body.text || body.text.trim().length === 0) {
      return alert("Please enter an RFP description.");
    }

    try {
      setLoading(true);
      const res = await API.post("/rfps", body);
      setResponse(res.data);
      setText("");
      setShowModal(false);

      const params = new URLSearchParams(window.location.search);
      const fromWizard = params.get("fromWizard");
      const nextStep = params.get("nextStep");
      if (fromWizard && nextStep) {
        navigate(`/wizard?step=${nextStep}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error creating RFP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h2>RFP Management</h2>
          <p>Create a new Request for Proposal or let AI build it from natural language.</p>
        </div>
        <div className="page-actions">
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            AI Creation
          </button>
        </div>
      </div>

      <div className="card-box">
        <h3>Quick RFP Draft</h3>
        <p>Type the procurement need and submit to create a structured RFP instantly.</p>

        <label>Describe your request</label>
        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. I need 20 ergonomic office chairs with adjustable height, budget 50k INR, delivery in 10 days."
        />

        <div className="card-actions">
          <button className="btn-primary" onClick={() => createRfp()} disabled={loading}>
            {loading ? "Creating..." : "Create RFP"}
          </button>
          <button className="btn-secondary" onClick={() => setShowModal(true)}>
            Use AI Modal
          </button>
        </div>
      </div>

      {response && (
        <div className="card-box">
          <div className="section-header">
            <div>
              <h3>Structured RFP Output</h3>
              <p>Review the JSON returned by the AI service.</p>
            </div>
          </div>
          <pre className="mono" style={{ background: "rgba(255,255,255,0.08)", padding: 20, borderRadius: 18, overflowX: "auto" }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-window">
            <div className="modal-header">
              <div>
                <h3>AI RFP Builder</h3>
                <p>Enter a casual description and let AI structure it.</p>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <label>AI RFP prompt</label>
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your procurement request in plain language..."
            />

            <div className="page-actions" style={{ justifyContent: "flex-end" }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={() => createRfp()} disabled={loading}>
                {loading ? "Generating..." : "Generate RFP"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
