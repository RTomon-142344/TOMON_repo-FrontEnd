import { useState, useRef } from 'react';

// ── Peephole Password Field ──────────────────────────────────
function PeepholePasswordField({ value, onChange, onKeyDown }) {
  const [peepOpen, setPeepOpen]     = useState(false);
  const [peepPos, setPeepPos]       = useState({ x: 50, y: 50 });
  const [sliding, setSliding]       = useState(false);
  const wrapRef                     = useRef(null);
  const inputRef                    = useRef(null);

  const togglePeep = () => {
    setSliding(true);
    setTimeout(() => setSliding(false), 400);
    setPeepOpen(p => !p);
  };

  const handleMouseMove = (e) => {
    if (!peepOpen || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    setPeepPos({
      x: Math.min(95, Math.max(5, x)),
      y: Math.min(90, Math.max(10, y)),
    });
  };

  const handleTouchMove = (e) => {
    if (!peepOpen || !wrapRef.current) return;
    const touch = e.touches[0];
    const rect  = wrapRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width)  * 100;
    const y = ((touch.clientY - rect.top)  / rect.height) * 100;
    setPeepPos({
      x: Math.min(95, Math.max(5, x)),
      y: Math.min(90, Math.max(10, y)),
    });
  };

  const peepSize = 72;

  return (
    <div className="peephole-wrap" ref={wrapRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <span className="login-input-icon">🔒</span>
      <input
        ref={inputRef}
        className="login-input peephole-input"
        type="text"
        placeholder="Enter your password"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoComplete="current-password"
        style={{ letterSpacing: peepOpen ? "normal" : "0.25em" }}
      />

      {!peepOpen && (
        <div
          className={`peep-overlay ${sliding ? "peep-closing" : ""}`}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="peep-dots">
            {Array.from({ length: Math.max(value.length, 8) }).map((_, i) => (
              <span
                key={i}
                className="peep-dot"
                style={{
                  opacity: i < value.length ? 1 : 0.2,
                  animationDelay: `${i * 0.04}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {peepOpen && (
        <div
          className={`peep-overlay peep-open ${sliding ? "peep-opening" : ""}`}
          style={{
            WebkitMaskImage: `radial-gradient(circle ${peepSize / 2}px at ${peepPos.x}% ${peepPos.y}%, transparent 0%, transparent 48%, black 52%)`,
            maskImage:        `radial-gradient(circle ${peepSize / 2}px at ${peepPos.x}% ${peepPos.y}%, transparent 0%, transparent 48%, black 52%)`,
          }}
          onClick={() => inputRef.current?.focus()}
        >
          <div
            className="peep-ring"
            style={{
              left: `calc(${peepPos.x}% - ${peepSize / 2}px)`,
              top:  `calc(${peepPos.y}% - ${peepSize / 2}px)`,
              width:  peepSize,
              height: peepSize,
            }}
          />
        </div>
      )}

      <button
        className={`peep-btn ${peepOpen ? "peep-btn-open" : ""}`}
        onClick={togglePeep}
        type="button"
        title={peepOpen ? "Close peephole" : "Peek at password"}
      >
        <span className={`peep-btn-icon ${sliding ? "peep-btn-spin" : ""}`}>
          {peepOpen ? "🚪" : "🕵️"}
        </span>
      </button>
    </div>
  );
}

// ── Login Page ───────────────────────────────────────────────
export default function Login({ onLogin, darkMode, onToggleDark }) {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials.");
        return;
      }

      // Save token and user for future requests
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onLogin(data.user);

    } catch (err) {
      setError("Cannot connect to server. Is Laravel running?");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-wrapper">

      {/* Left decorative panel */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand-icon">A</div>
          <h1 className="login-brand-title">AcadPortal</h1>
          <p className="login-brand-sub">Academic Management System</p>
          <div className="login-features">
            <div className="login-feature-item">🎓 Manage Program Offerings</div>
            <div className="login-feature-item">📚 Track Subject Offerings</div>
            <div className="login-feature-item">📊 Dashboard Analytics</div>
            <div className="login-feature-item">🔍 Advanced Filters &amp; Search</div>
          </div>
        </div>
        <div className="login-left-circles">
          <div className="circle circle-1" />
          <div className="circle circle-2" />
          <div className="circle circle-3" />
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-right">

        {/* Dark mode toggle */}
        <button
          className="login-theme-btn"
          onClick={onToggleDark}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <div className="login-card">
          <div className="login-header">
            <div className="login-logo-sm">A</div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your account to continue</p>
          </div>

          <div className="login-form">

            {/* Email */}
            <div className="login-form-group">
              <label className="login-label">Email</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">✉️</span>
                <input
                  className="login-input"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            {/* Password — Peephole */}
            <div className="login-form-group">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label className="login-label" style={{ margin: 0 }}>Password</label>
                <span className="peep-hint">🕵️ Move cursor to peek</span>
              </div>
              <PeepholePasswordField
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={handleKeyDown}
              />
            </div>

            {error && <div className="login-error">⚠️ {error}</div>}

            <button
              className={`login-btn ${loading ? "loading" : ""}`}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <span className="login-spinner" /> : "Sign In →"}
            </button>

          </div>

          <div className="login-footer">
            AcadPortal · Academic Year 2024–2025
          </div>
        </div>
      </div>
    </div>
  );
}