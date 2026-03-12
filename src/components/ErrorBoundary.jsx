import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary:", error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const err = this.state.error;
      const message = err?.message ?? String(err);
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#0a0a0a",
            color: "#fafafa",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            maxWidth: "480px",
            margin: "0 auto",
          }}
        >
          <h1 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Qualcosa è andato storto</h1>
          <p style={{ color: "#a1a1a1", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
            Ricarica la pagina. Se il problema continua, controlla la console (F12).
          </p>
          {message && (
            <pre
              style={{
                background: "#1a1a1a",
                color: "#e6007e",
                padding: "0.75rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                textAlign: "left",
                overflow: "auto",
                maxHeight: "120px",
                width: "100%",
                marginBottom: "1rem",
              }}
            >
              {message}
            </pre>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "0.6rem 1.2rem",
              background: "#e6007e",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Ricarica
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
