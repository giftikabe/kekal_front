import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Last-resort fallback so a single rendering bug (a bad API response, a
 * malformed image URL, etc.) shows a recoverable message instead of a
 * blank white screen with no way forward for the visitor.
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error("Unhandled UI error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "2rem",
            textAlign: "center",
            fontFamily: "sans-serif",
          }}
        >
          <h1 style={{ fontSize: "1.5rem" }}>Something went wrong.</h1>
          <p style={{ color: "#666" }}>
            Please refresh the page. If the problem continues, contact us.
          </p>
          <button
            onClick={() => window.location.assign("/")}
            style={{
              padding: "0.75rem 1.5rem",
              border: "1px solid #141414",
              background: "#141414",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Return home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
