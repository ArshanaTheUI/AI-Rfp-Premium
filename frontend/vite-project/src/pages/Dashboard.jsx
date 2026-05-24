import { useEffect, useState } from "react";
import { API } from "../api";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    async function loadStats() {
        try {
            setLoading(true);
            const res = await API.get("/stats");
            setStats(res.data);
        } catch (err) {
            console.error("Stats load error", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadStats();
    }, []);

    // useEffect(() => {
    //     const done = localStorage.getItem("rfp_wizard_done");
    //     if (!done) {
    //         navigate("/wizard");
    //     }
    // }, []);

    if (loading) return <div className="dashboard-container">Loading...</div>;

    return (
        <div className="page">
            <div className="section-header">
                <div>
                    <h2>RFP Command Center</h2>
                    <p>Track recent activity, launch new requests, and review vendor performance.</p>
                </div>
                <div className="page-actions">
                    <Link to="/create-rfp" className="btn-primary">Create RFP</Link>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-main">
                    <div className="metric-grid">
                        <div className="metric-card">
                            <div className="metric-title">Active RFPs</div>
                            <div className="metric-value">{stats.rfpCount}</div>
                            <span className="badge-pill">Live</span>
                        </div>
                        <div className="metric-card">
                            <div className="metric-title">Vendors</div>
                            <div className="metric-value">{stats.vendorCount}</div>
                            <span className="badge-pill">Network</span>
                        </div>
                        <div className="metric-card">
                            <div className="metric-title">Proposals</div>
                            <div className="metric-value">{stats.proposalCount}</div>
                            <span className="badge-pill">Inbox</span>
                        </div>
                    </div>

                    <div className="card-box">
                        <div className="section-header">
                            <div>
                                <h3>Recent RFPs</h3>
                                <p>Latest requests from your procurement team.</p>
                            </div>
                        </div>

                        {stats.recentRfps.length === 0 ? (
                            <p>No recent RFPs yet.</p>
                        ) : (
                            <div className="recent-list">
                                {stats.recentRfps.map((r) => (
                                    <div key={r._id} className="recent-item">
                                        <div>
                                            <strong>{r.title || "Untitled RFP"}</strong>
                                            <p>{new Date(r.createdAt).toLocaleString()}</p>
                                        </div>
                                        <Link to={`/rfp/${r._id}`} className="badge-pill">View</Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <aside className="dashboard-aside">
                    <div className="panel-card">
                        <div className="section-header">
                            <div>
                                <h4>Activity Feed</h4>
                                <p>Recent actions and system events.</p>
                            </div>
                        </div>
                        <div className="activity-list">
                            {stats.recentRfps.slice(0, 5).map((r) => (
                                <div key={r._id} className="activity-item activty_flex">
                                    <span className="status-pill">New</span>
                                    <div>
                                        <strong>{r.title || "Unnamed RFP"}</strong>
                                        <p>Created {new Date(r.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="panel-card">
                        <div className="section-header">
                            <div>
                                <h4>Quick Actions</h4>
                            </div>
                        </div>
                        <div className="page-actions">
                            <Link to="/create-rfp" className="btn-primary">New RFP</Link>
                            <Link to="/vendors" className="btn-secondary">Add Vendors</Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
