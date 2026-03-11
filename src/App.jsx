import { useState, useEffect, useRef } from 'react';
import './styles/global.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProgramList from './components/ProgramList';
import SubjectList from './components/SubjectList';

// ── Logout Confirmation Modal ────────────────────────────────
function LogoutConfirm({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal logout-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-body" style={{ padding: "36px 32px" }}>
          <div className="logout-icon">👋</div>
          <div className="logout-title">Leaving Already?</div>
          <div className="logout-text">
            Are you sure you want to log out of the Academic Portal?
            You'll need to sign in again to access your dashboard.
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
            <button className="btn btn-outline" onClick={onCancel}>Stay Here</button>
            <button className="btn btn-danger" onClick={onConfirm}>Log Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Profile Dropdown ─────────────────────────────────────────
function ProfileDropdown({ currentUser, darkMode, onToggleDark, onLogout, onClose }) {
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div className="profile-dropdown" ref={ref}>

      {/* Header — user info */}
      <div className="dropdown-header">
        <div className="dropdown-avatar">
          {currentUser.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="dropdown-name">{currentUser}</div>
          <div className="dropdown-role">Administrator</div>
        </div>
      </div>

      <div className="dropdown-body">

        {/* Profile */}
        <div className="dropdown-item" onClick={onClose}>
          <span className="dropdown-item-icon">👤</span>
          <div>
            <div className="dropdown-item-label">My Profile</div>
            <div className="dropdown-item-sub">View your account info</div>
          </div>
        </div>

        {/* Settings */}
        <div className="dropdown-item" onClick={onClose}>
          <span className="dropdown-item-icon">⚙️</span>
          <div>
            <div className="dropdown-item-label">Settings</div>
            <div className="dropdown-item-sub">Manage preferences</div>
          </div>
        </div>

        <div className="dropdown-divider" />

        {/* Dark Mode Toggle */}
        <div className="dark-toggle-row" onClick={onToggleDark}>
          <span className="dropdown-item-icon">{darkMode ? "☀️" : "🌙"}</span>
          <div style={{ flex: 1 }}>
            <div className="dropdown-item-label">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </div>
            <div className="dropdown-item-sub">
              {darkMode ? "Switch to light theme" : "Switch to dark theme"}
            </div>
          </div>
          <div className={`toggle-switch ${darkMode ? "on" : ""}`}>
            <div className="toggle-knob" />
          </div>
        </div>

        <div className="dropdown-divider" />

        {/* Logout */}
        <div className="dropdown-item danger" onClick={() => { onClose(); onLogout(); }}>
          <span className="dropdown-item-icon">🚪</span>
          <div>
            <div className="dropdown-item-label">Log Out</div>
            <div className="dropdown-item-sub">Sign out of your account</div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn]         = useState(false);
  const [currentUser, setCurrentUser]   = useState("");
  const [page, setPage]                 = useState("dashboard");
  const [collapsed, setCollapsed]       = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [showLogout, setShowLogout]     = useState(false);
  const [darkMode, setDarkMode]         = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Apply dark mode to <html> data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDark = () => setDarkMode(d => !d);

  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "programs",  icon: "🎓", label: "Programs"  },
    { id: "subjects",  icon: "📚", label: "Subjects"  },
  ];

  const pageTitles = {
    dashboard: "Dashboard",
    programs:  "Program Offerings",
    subjects:  "Subject Offerings",
  };

  // ── SCREEN 1: Login ────────────────────────────────────────
  if (!loggedIn) {
    return (
      <Login
        darkMode={darkMode}
        onToggleDark={toggleDark}
        onLogin={(user) => {
          setCurrentUser(user.name);
          setLoggedIn(true);
          setPage("dashboard");
        }}
      />
    );
  }

  // ── SCREEN 2: Main App ─────────────────────────────────────
  return (
    <div className="app-wrapper" style={{ display: "flex", minHeight: "100vh", width: "100vw", position: "relative" }}>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">A</div>
          {!collapsed && (
            <div className="logo-text">
              <div className="logo-title">AcadPortal</div>
              <div className="logo-sub">Academic Management</div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            {!collapsed && <div className="nav-section-title">Navigation</div>}
            {navItems.map(item => (
              <div
                key={item.id}
                className={`nav-item ${page === item.id ? "active" : ""}`}
                onClick={() => { setPage(item.id); setMobileOpen(false); }}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </div>
            ))}
          </div>
        </nav>

        {/* User + Logout */}
        <div className="sidebar-footer">
          {!collapsed && (
            <div className="sidebar-user-label">
              Logged in as{" "}
              <strong style={{ color: "var(--gold)" }}>{currentUser}</strong>
            </div>
          )}
          <button className="logout-btn" onClick={() => setShowLogout(true)}>
            <span className="nav-icon">🚪</span>
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button className="sidebar-toggle" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? "›" : "‹"}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`main-content ${collapsed ? "expanded" : ""}`}
        style={{
          marginLeft: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-w)",
          width: collapsed ? "calc(100vw - var(--sidebar-collapsed))" : "calc(100vw - var(--sidebar-w))",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: "var(--transition)",
        }}
      >

        {/* Top Bar */}
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="hamburger" onClick={() => setMobileOpen(o => !o)}>☰</button>
            <div className="topbar-left">
              <div className="topbar-title">{pageTitles[page]}</div>
              <div className="topbar-breadcrumb">AcadPortal › {pageTitles[page]}</div>
            </div>
          </div>

          <div className="topbar-right">
            <div className="topbar-badge">AY 2024–2025</div>

            {/* Avatar with dropdown */}
            <div className="avatar-wrap">
              <div
                className={`topbar-avatar ${dropdownOpen ? "open" : ""}`}
                title={currentUser}
                onClick={() => setDropdownOpen(o => !o)}
              >
                {currentUser.charAt(0).toUpperCase()}
              </div>

              {dropdownOpen && (
                <ProfileDropdown
                  currentUser={currentUser}
                  darkMode={darkMode}
                  onToggleDark={toggleDark}
                  onLogout={() => setShowLogout(true)}
                  onClose={() => setDropdownOpen(false)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-content">
          {page === "dashboard" && <Dashboard />}
          {page === "programs"  && <ProgramList />}
          {page === "subjects"  && <SubjectList />}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogout && (
        <LogoutConfirm
          onCancel={() => setShowLogout(false)}
          onConfirm={() => {
            setShowLogout(false);
            setLoggedIn(false);
            setCurrentUser("");
            setPage("dashboard");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }}
        />
      )}
    </div>
  );
}