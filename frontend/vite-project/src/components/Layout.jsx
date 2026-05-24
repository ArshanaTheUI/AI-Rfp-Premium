import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/layout.css";

const navItems = [
  { to: "/", label: "Dashboard", icon: "🏠" },
  { to: "/create-rfp", label: "Create RFP", icon: "📝" },
  { to: "/vendors", label: "Vendors", icon: "👥" },
  { to: "/send-rfp", label: "Send RFP", icon: "✉️" },
  { to: "/rfps", label: "RFP List", icon: "📄" },
  { to: "/wizard", label: "Wizard", icon: "🚀" },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={`app-shell ${collapsed ? "collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">AI</div>
          <div className="brand-copy">
            <h1>AI RFP</h1>
            <p>Procurement hub</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              data-label={item.label}
              className={
                location.pathname === item.to
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">A</div>
            <div className="user-info">
              <div className="user-name">Arshana</div>
              <div className="user-role">Procurement Lead</div>
            </div>
            <div style={{marginLeft:'auto'}} className="status-dot" />
          </div>

          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>
      </aside>

      <div className="content-shell">
        <Navbar />
        <main className="content-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
