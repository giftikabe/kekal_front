import { useEffect, useRef, useState } from "react";

interface PreviewFrameProps {
  /** Raw TSX source, exactly as typed/loaded in the editor. Never persisted. */
  tsxCode: string;
  /** Raw CSS (treated as plain global CSS in the sandbox — CSS Modules
   * scoping doesn't matter for a preview, only "does it look right"). */
  cssCode?: string;
  /** Component's exported name — must match `export default function Name`. */
  componentName: string;
  /** Prop values to render with (placeholders in Component Library,
   * resolved real/bound values in Page Builder). */
  props: Record<string, unknown>;
  height?: number | string;
  label?: string;
}

/**
 * Renders arbitrary admin-authored TSX safely:
 *  - compiled client-side with Babel standalone (loaded from a CDN inside
 *    the iframe, not bundled into the admin app)
 *  - executed inside a sandboxed same-origin-less iframe (srcDoc), so a
 *    broken/malicious component can't touch the parent admin page's DOM,
 *    globals, or auth tokens
 *  - communicates only via postMessage (code/props/css in, height/error out)
 *
 * This exists because code is never stored in Postgres — there is nothing
 * for a server to render ahead of time. Preview always compiles-on-the-fly
 * from whatever is currently in the editor (or fetched fresh from GitHub
 * for an already-published component).
 */
export default function PreviewFrame({
  tsxCode,
  cssCode = "",
  componentName,
  props,
  height = 360,
  label,
}: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string>("");
  const [ready, setReady] = useState(false);

  // Post the latest code/props into the iframe whenever they change.
  useEffect(() => {
    if (!ready) return;
    setError("");
    iframeRef.current?.contentWindow?.postMessage(
      { type: "kekal-preview-render", tsxCode, cssCode, componentName, props },
      "*"
    );
  }, [ready, tsxCode, cssCode, componentName, props]);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "kekal-preview-ready") {
        setReady(true);
      } else if (e.data?.type === "kekal-preview-error") {
        setError(e.data.message || "Unknown preview error");
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div style={{ border: "1px solid #eee", background: "#fafafa" }}>
      {label && (
        <div
          style={{
            padding: "6px 10px",
            fontSize: 11,
            color: "#999",
            borderBottom: "1px solid #eee",
            background: "#fff",
          }}
        >
          {label}
        </div>
      )}
      {error && (
        <div style={{ padding: 10, fontSize: 12, color: "#c00", background: "#fff5f5", fontFamily: "monospace" }}>
          {error}
        </div>
      )}
      <iframe
        ref={iframeRef}
        title={`preview-${componentName}`}
        srcDoc={SANDBOX_HTML}
        style={{ width: "100%", height, border: "none", display: "block", background: "#fff" }}
        sandbox="allow-scripts"
        onLoad={() => {
          // The sandbox script sends "kekal-preview-ready" itself once
          // React/Babel have loaded; nothing to do here.
        }}
      />
    </div>
  );
}

// Self-contained sandbox document: loads React + ReactDOM + Babel standalone
// from a CDN, listens for render messages, compiles JSX/TSX on the fly, and
// renders it. Runs with `sandbox="allow-scripts"` only — no
// allow-same-origin — so it cannot read parent cookies/localStorage/DOM.
const SANDBOX_HTML = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style id="kekal-preview-css"></style>
<style>
  html, body { margin: 0; padding: 0; font-family: system-ui, sans-serif; }
  #root { min-height: 100vh; }
</style>
</head>
<body>
<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
<script>
  var root = null;
  function post(type, payload) {
    window.parent.postMessage(Object.assign({ type: type }, payload || {}), "*");
  }

  function render(data) {
    try {
      document.getElementById("kekal-preview-css").textContent = data.cssCode || "";

      // Strip TS-only import/interface/type syntax the plain Babel React
      // preset alone won't fully handle, then transform with the
      // TypeScript preset for real. We also strip the CSS-module import
      // line since there's no bundler here — the class names still work
      // because the raw CSS above is applied globally with the same
      // class names your CSS Modules file uses (module: false at author
      // time means .foo in CSS becomes .foo in the DOM either way).
      var source = data.tsxCode
        .replace(/^import\\s+styles\\s+from\\s+["'].*module\\.css["'];?\\s*$/gm, "")
        .replace(/^import\\s+.*from\\s+["'].*["'];?\\s*$/gm, function (line) {
          // Keep React import no-op (we already have a global React), drop
          // everything else (icons, hooks, router) since preview has none
          // of that wired up — components that hard-depend on router/data
          // hooks will show their own runtime error here, which is
          // expected: preview is for layout/visual props, not full app wiring.
          return "";
        })
        .replace(/styles\\./g, "__cls_"); // styles.foo -> __cls_foo (see below)

      // Since we can't resolve the CSS module import, "styles.foo" in the
      // component becomes the literal string "foo" via a small runtime
      // shim, so raw class names in the injected CSS still match.
      var proxy = new Proxy({}, { get: function (_t, prop) { return String(prop); } });
      window.__cls_proxy = proxy;
      source = source.replace(/__cls_/g, "");

      var compiled = Babel.transform(source, {
        presets: ["react", "typescript"],
        filename: "component.tsx",
      }).code;

      var exportsObj = {};
      var moduleObj = { exports: exportsObj };
      var fn = new Function("React", "module", "exports", compiled + "\\nreturn module.exports.default || exports.default;");
      var Component = fn(window.React, moduleObj, exportsObj);

      if (!Component) throw new Error("No default export found in component code.");

      if (!root) root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(window.React.createElement(Component, data.props || {}));
      post("kekal-preview-ready");
    } catch (err) {
      post("kekal-preview-error", { message: (err && err.message) || String(err) });
    }
  }

  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "kekal-preview-render") render(e.data);
  });

  post("kekal-preview-ready");
</script>
</body>
</html>`;
