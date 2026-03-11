// src/components/common/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="empty-state">
          <div className="empty-icon">💥</div>
          <div className="empty-title">Something went wrong</div>
          <div className="empty-text" style={{ maxWidth: 400 }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </div>
          <button
            className="btn btn-gold"
            style={{ marginTop: 16 }}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}