// src/components/common/LoadingSpinner.jsx

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "60px 20px", gap: 16,
    }}>
      <div style={{
        width: 44, height: 44,
        border: "4px solid var(--border)",
        borderTop: "4px solid var(--maroon)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{message}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}