import { useState, useRef } from 'react';

// ── Peephole Password Field (same as Login) ──────────────────
function PeepholePasswordField({ value, onChange, onKeyDown, placeholder = "Enter your password" }) {
  const [peepOpen, setPeepOpen] = useState(false);
  const [peepPos, setPeepPos]   = useState({ x: 50, y: 50 });
  const [sliding, setSliding]   = useState(false);
  const wrapRef  = useRef(null);
  const inputRef = useRef(null);

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
    setPeepPos({ x: Math.min(95, Math.max(5, x)), y: Math.min(90, Math.max(10, y)) });
  };

  const handleTouchMove = (e) => {
    if (!peepOpen || !wrapRef.current) return;
    const touch = e.touches[0];
    const rect  = wrapRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width)  * 100;
    const y = ((touch.clientY - rect.top)  / rect.height) * 100;
    setPeepPos({ x: Math.min(95, Math.max(5, x)), y: Math.min(90, Math.max(10, y)) });
  };

  const peepSize = 72;

  return (
    <div className="peephole-wrap" ref={wrapRef}
      onMouseMove={handleMouseMove} onTouchMove={handleTouchMove}>
      <span className="login-input-icon">🔒</span>
      <input
        ref={inputRef}
        className="login-input peephole-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoComplete="new-password"
        style={{ letterSpacing: peepOpen ? "normal" : "0.25em" }}
      />

      {!peepOpen && (
        <div className={`peep-overlay ${sliding ? "peep-closing" : ""}`}
          onClick={() => inputRef.current?.focus()}>
          <div className="peep-dots">
            {Array.from({ length: Math.max(value.length, 8) }).map((_, i) => (
              <span key={i} className="peep-dot"
                style={{ opacity: i < value.length ? 1 : 0.2, animationDelay: `${i * 0.04}s` }} />
            ))}
          </div>
        </div>
      )}

      {peepOpen && (
        <div
          className={`peep-overlay peep-open ${sliding ? "peep-opening" : ""}`}
          style={{
            WebkitMaskImage: `radial-gradient(circle ${peepSize / 2}px at ${peepPos.x}% ${peepPos.y}%, transparent 0%, transparent 48%, black 52%)`,
            maskImage:       `radial-gradient(circle ${peepSize / 2}px at ${peepPos.x}% ${peepPos.y}%, transparent 0%, transparent 48%, black 52%)`,
          }}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="peep-ring" style={{
            left: `calc(${peepPos.x}% - ${peepSize / 2}px)`,
            top:  `calc(${peepPos.y}% - ${peepSize / 2}px)`,
            width: peepSize, height: peepSize,
          }} />
        </div>
      )}

      <button className={`peep-btn ${peepOpen ? "peep-btn-open" : ""}`}
        onClick={togglePeep} type="button"
        title={peepOpen ? "Close peephole" : "Peek at password"}>
        <span className={`peep-btn-icon ${sliding ? "peep-btn-spin" : ""}`}>
          {peepOpen ? "🚪" : "🕵️"}
        </span>
      </button>
    </div>
  );
}

// ── Register Page ────────────────────────────────────────────
export default function Register({ onLogin, onSwitchToLogin, darkMode, onToggleDark }) {
  const [form, setForm]     = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [errors, setErrors] = useState({});
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  // Client-side validation
  const validate = () => {
    const e = {};
    if (!form.name.trim())                              e.name     = "Full name is required.";
    if (!form.email.trim())                             e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))         e.email    = "Enter a valid email.";
    if (!form.password)                                 e.password = "Password is required.";
    else if (form.password.length < 8)                  e.password = "Password must be at least 8 characters.";
    if (form.password !== form.password_confirmation)   e.password_confirmation = "Passwords do not match.";
    return e;
  };

  const handleRegister = async () => {
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) { setErrors(clientErrors); return; }
    setErrors({});
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        // Laravel returns field errors as { errors: { field: ["msg"] } }
        if (data.errors) {
          const serverErrors = {};
          Object.keys(data.errors).forEach(k => { serverErrors[k] = data.errors[k][0]; });
          setErrors(serverErrors);
        } else {
          setError(data.message || "Registration failed.");
        }
        return;
      }

      // Auto-login after registration
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);

    } catch (err) {
      setError("Cannot connect to server. Is Laravel running?");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleRegister(); };

  // Update field and clear its error
  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(ev => ({ ...ev, [field]: undefined }));
  };

  return (
    <div className="login-wrapper">
      {/* Left panel — identical to Login */}
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
        <button className="login-theme-btn" onClick={onToggleDark}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {darkMode ? "☀️" : "🌙"}
        </button>

        <div className="login-card">
          <div className="login-header">
            <div className="login-logo-sm">A</div>
            <h2 className="login-title">Create Account</h2>
            <p className="login-subtitle">Register to get started with AcadPortal</p>
          </div>

          <div className="login-form">

            {/* Full Name */}
            <div className="login-form-group">
              <label className="login-label">Full Name</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">👤</span>
                <input
                  className="login-input"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={set("name")}
                  onKeyDown={handleKeyDown}
                />
              </div>
              {errors.name && <div className="login-error" style={{ marginTop: 4 }}>⚠️ {errors.name}</div>}
            </div>

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
                  onChange={set("email")}
                  onKeyDown={handleKeyDown}
                />
              </div>
              {errors.email && <div className="login-error" style={{ marginTop: 4 }}>⚠️ {errors.email}</div>}
            </div>

            {/* Password */}
            <div className="login-form-group">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label className="login-label" style={{ margin: 0 }}>Password</label>
                <span className="peep-hint">🕵️ Move cursor to peek</span>
              </div>
              <PeepholePasswordField
                value={form.password}
                onChange={set("password")}
                onKeyDown={handleKeyDown}
                placeholder="Min. 8 characters"
              />
              {errors.password && <div className="login-error" style={{ marginTop: 4 }}>⚠️ {errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div className="login-form-group">
              <label className="login-label">Confirm Password</label>
              <PeepholePasswordField
                value={form.password_confirmation}
                onChange={set("password_confirmation")}
                onKeyDown={handleKeyDown}
                placeholder="Re-enter your password"
              />
              {errors.password_confirmation && (
                <div className="login-error" style={{ marginTop: 4 }}>⚠️ {errors.password_confirmation}</div>
              )}
            </div>

            {error && <div className="login-error">⚠️ {error}</div>}

            <button className={`login-btn ${loading ? "loading" : ""}`}
              onClick={handleRegister} disabled={loading}>
              {loading ? <span className="login-spinner" /> : "Create Account →"}
            </button>

            {/* Link back to Login */}
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <span style={{ fontSize: 13, opacity: 0.7 }}>Already have an account? </span>
              <button type="button" onClick={onSwitchToLogin} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600,
                color: "var(--accent, #4f8ef7)", textDecoration: "underline",
              }}>
                Sign In
              </button>
            </div>

          </div>

          <div className="login-footer">AcadPortal · Academic Year 2024–2025</div>
        </div>
      </div>
    </div>
  );
}