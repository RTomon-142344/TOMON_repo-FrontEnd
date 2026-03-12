import { useState, useEffect, useRef } from 'react';
import './styles/global.css';
import Login         from './components/Login';
import Register      from './components/Register';
import Dashboard     from './components/Dashboard';
import ProgramList   from './components/ProgramList';
import SubjectList   from './components/SubjectList';
import WeatherWidget from './components/WeatherWidget';

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

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div className="profile-dropdown" ref={ref}>
      <div className="dropdown-header">
        <div className="dropdown-avatar">{currentUser.charAt(0).toUpperCase()}</div>
        <div>
          <div className="dropdown-name">{currentUser}</div>
          <div className="dropdown-role">Administrator</div>
        </div>
      </div>
      <div className="dropdown-body">
        <div className="dropdown-item" onClick={onClose}>
          <span className="dropdown-item-icon">👤</span>
          <div>
            <div className="dropdown-item-label">My Profile</div>
            <div className="dropdown-item-sub">View your account info</div>
          </div>
        </div>
        <div className="dropdown-item" onClick={onClose}>
          <span className="dropdown-item-icon">⚙️</span>
          <div>
            <div className="dropdown-item-label">Settings</div>
            <div className="dropdown-item-sub">Manage preferences</div>
          </div>
        </div>
        <div className="dropdown-divider" />
        <div className="dark-toggle-row" onClick={onToggleDark}>
          <span className="dropdown-item-icon">{darkMode ? "☀️" : "🌙"}</span>
          <div style={{ flex: 1 }}>
            <div className="dropdown-item-label">{darkMode ? "Light Mode" : "Dark Mode"}</div>
            <div className="dropdown-item-sub">{darkMode ? "Switch to light theme" : "Switch to dark theme"}</div>
          </div>
          <div className={`toggle-switch ${darkMode ? "on" : ""}`}>
            <div className="toggle-knob" />
          </div>
        </div>
        <div className="dropdown-divider" />
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
  const [authPage, setAuthPage]         = useState("login");
  const [page, setPage]                 = useState("dashboard");
  const [collapsed, setCollapsed]       = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [showLogout, setShowLogout]     = useState(false);
  const [darkMode, setDarkMode]         = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ── Restore session on page refresh ───────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user  = localStorage.getItem("user");
    if (token && user) {
      try {
        const parsed = JSON.parse(user);
        setCurrentUser(parsed.name);
        setLoggedIn(true);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDark = () => setDarkMode(d => !d);

  const handleLogin = (user) => {
    setCurrentUser(user.name);
    setLoggedIn(true);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setShowLogout(false);
    setLoggedIn(false);
    setCurrentUser("");
    setPage("dashboard");
    setAuthPage("login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "programs",  icon: "🎓", label: "Programs"  },
    { id: "subjects",  icon: "📚", label: "Subjects"  },
    { id: "weather",   icon: "🌤️", label: "Weather"   },
  ];

  const pageTitles = {
    dashboard: "Dashboard",
    programs:  "Program Offerings",
    subjects:  "Subject Offerings",
    weather:   "Weather Forecast",
  };

  // Sidebar widths — 0 on mobile (CSS handles it via media query)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const sidebarW = isMobile ? "0px" : collapsed ? "70px" : "260px";

  // ── SCREEN 1: Auth ─────────────────────────────────────────
  if (!loggedIn) {
    if (authPage === "register") {
      return (
        <Register
          darkMode={darkMode}
          onToggleDark={toggleDark}
          onLogin={handleLogin}
          onSwitchToLogin={() => setAuthPage("login")}
        />
      );
    }
    return (
      <Login
        darkMode={darkMode}
        onToggleDark={toggleDark}
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthPage("register")}
      />
    );
  }

  // ── SCREEN 2: Main App ─────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw" }}>

      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">A</div>
          {!collapsed && (
            <div className="logo-text">
              <div className="logo-title">AcadPortal</div>
              <div className="logo-sub">Academic Management</div>
            </div>
          )}
        </div>

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

        <button className="sidebar-toggle" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? "›" : "‹"}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{
        marginLeft: sidebarW,
        width: `calc(100vw - ${sidebarW})`,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)",
        background: "var(--bg)",
        overflow: "hidden",
      }}>

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
          {page === "weather"   && (
            <div style={{ maxWidth: 700 }}>
              <WeatherWidget />
            </div>
          )}
        </div>
      </main>

      {showLogout && (
        <LogoutConfirm
          onCancel={() => setShowLogout(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}