/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Copy, Check, Eye, Save, Send, ChevronLeft, Trash2 } from "lucide-react";
import { api } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ui from "../components/ui.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FieldSchema {
  name: string;
  type: "text" | "image" | "richtext" | "list";
}

interface SectionTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  tsx_code: string;
  css_code: string;
  field_schema: string; // JSON
  data_source: string | null;
  published: boolean;
}

const DATA_SOURCES = [
  { value: "",               label: "None (static / placeholder only)" },
  { value: "products",       label: "Products" },
  { value: "collections",    label: "Collections" },
  { value: "events",         label: "Events" },
  { value: "upcomingEvents", label: "Upcoming Events" },
];

// ─── AI Prompt Generator ──────────────────────────────────────────────────────

function buildPrompt(
  description: string,
  fields: FieldSchema[],
  dataSource: string,
  slug: string,
) {
  const fieldList = fields.length
    ? fields
        .map((f) => `  - ${f.name} (${f.type})`)
        .join("\n")
    : "  (no specific fields — use placeholder-data.json values)";

  const dataNote = dataSource
    ? `The section will receive live data from the "${dataSource}" database table as an array prop called \`items\`. Each item has the shape of the ${dataSource} DB record.`
    : `The section uses static placeholder data. All data comes from a JSON object called \`placeholder\` with this shape (imported at the top of the file):
\`\`\`
{
  heading, subheading, title, paragraph, label, label2, caption,
  name, role, date, location, quote, author,
  image, image2, image3, images[],
  items[{ id, title, text, image, label, date }],
  stats[{ label, value }]
}
\`\`\``;

  return `You are a React + TypeScript developer building a section component for a fashion brand website called KEKAL.

## What to build
${description}

## Component name
\`${slug}\`

## Files to produce
Produce TWO files, clearly separated with these exact headings:
### FILE: ${slug}.tsx
### FILE: ${slug}.module.css

## Technical requirements
- React functional component, TypeScript (.tsx)
- CSS Modules for styling (import styles from "./${slug}.module.css")
- The component file name must be exactly: ${slug}.tsx
- Use this EXACT import at the top of the TSX for placeholder data:
  \`import placeholder from "../../public/placeholder-data.json";\`
  (adjust the relative path if needed — always import from public/placeholder-data.json)
- ${dataNote}
- Props the component accepts:
${fieldList}
- All images: use <img> tags with object-fit: cover
- No external libraries except what React provides
- Mobile-responsive using CSS media queries
- Minimal, elegant design matching a high-end fashion brand aesthetic
- Colors: use CSS custom properties --color-black, --color-white, --color-gray, --color-accent
- Typography: use font-family: inherit (the site sets it globally)
- Export the component as a default export

## What NOT to do
- Do NOT use Tailwind
- Do NOT use styled-components
- Do NOT import from any path outside the component's own folder and public/
- Do NOT add a Router or any routing logic
- Do NOT add a global layout (no Header/Footer)

## Output format
Return ONLY the two files with their headings. No explanation, no markdown fences around the whole response — only the two ### FILE: headings followed by the code.`;
}

// ─── Live Preview ─────────────────────────────────────────────────────────────

function LivePreview({ tsxCode, cssCode }: { tsxCode: string; cssCode: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!iframeRef.current) return;
    setError("");

    // The iframe document: loads Babel standalone, transpiles the TSX,
    // injects CSS, renders the component into a div.
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --color-black: #000;
      --color-white: #fff;
      --color-gray: #888;
      --color-accent: #c8a96e;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    body { background: #fff; }
    #error { color: red; padding: 16px; font-family: monospace; font-size: 12px; white-space: pre-wrap; }
  </style>
  <style id="component-css">${cssCode || ""}</style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.development.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.development.js"></script>
</head>
<body>
  <div id="root"></div>
  <div id="error"></div>
  <script>
    // Inject placeholder data as a global so the component can import it
    window.__placeholder = ${JSON.stringify({
      heading: "Section Heading",
      subheading: "A short supporting line",
      title: "Card Title",
      paragraph: "This is placeholder text for your section preview.",
      label: "Learn More", label2: "Get Started",
      caption: "Caption", name: "Full Name", role: "Designer & Founder",
      date: "August 2026", location: "Addis Ababa, Ethiopia",
      quote: "Fashion is a form of self-expression.",
      author: "Kekal Studio",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      image2: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      image3: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
      ],
      items: [
        { id:"1", title:"Item One", text:"Short description.", image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", label:"View", date:"Aug 2026" },
        { id:"2", title:"Item Two", text:"Short description.", image:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80", label:"View", date:"Jul 2026" },
        { id:"3", title:"Item Three", text:"Short description.", image:"https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80", label:"View", date:"Jun 2026" },
      ],
      stats: [{ label:"Years", value:"10+" }, { label:"Pieces", value:"500+" }, { label:"Countries", value:"12" }],
    })};
  </script>
  <script type="text/babel" data-presets="react,typescript">
    const { useState, useEffect, useRef } = React;
    // Simulate CSS Modules: return className as-is (preview only)
    const styles = new Proxy({}, { get: (_, key) => key });
    // Simulate placeholder import
    const placeholder = window.__placeholder;

    try {
      ${tsxCode
        // Strip import statements (not valid in inline script)
        .replace(/^import\s+.*?from\s+['"][^'"]*['"];?\s*/gm, "")
        // Strip export default keyword, keep the function
        .replace(/export\s+default\s+function/, "function")
        // Strip "export default ComponentName;" at end
        .replace(/export\s+default\s+\w+\s*;?\s*$/, "")
      }

      // Find the component: look for a function that returns JSX
      const componentNames = Object.getOwnPropertyNames(window)
        .filter(k => typeof window[k] === 'function' && /^[A-Z]/.test(k));

      // Try to find by slug hint injected below
      const slug = "${cssCode ? "component" : "component"}";
      let Component = null;

      // The TSX defines a function — grab the last defined capitalized function
      const fnMatch = \`${tsxCode}\`.match(/function\\s+([A-Z][\\w]*)/g);
      if (fnMatch) {
        const lastName = fnMatch[fnMatch.length - 1].replace("function ", "").trim();
        if (typeof eval(lastName) === "function") Component = eval(lastName);
      }

      if (!Component) {
        document.getElementById("error").textContent = "Could not find a React component. Make sure your function name starts with a capital letter.";
      } else {
        const root = ReactDOM.createRoot(document.getElementById("root"));
        root.render(React.createElement(Component, window.__placeholder));
      }
    } catch(e) {
      document.getElementById("error").textContent = "Preview error: " + e.message;
    }
  </script>
</body>
</html>`;

    const doc = iframeRef.current.contentDocument;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, [tsxCode, cssCode]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {error && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "#fee", padding: 8, fontSize: 11, color: "#c00", zIndex: 10 }}>
          {error}
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="Section Preview"
        sandbox="allow-scripts"
        style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
      />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TemplateEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { hasPermission } = useAuthContext();
  const isNew = !id || id === "new";

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    tsx_code: "",
    css_code: "",
    field_schema: "[]",
    data_source: "",
  });
  const [fields, setFields] = useState<FieldSchema[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"info" | "code" | "preview">("info");
  const [promptModal, setPromptModal] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [sectionDescription, setSectionDescription] = useState("");

  const canEdit = hasPermission("page_sections", "update");

  // Load existing template
  useEffect(() => {
    if (isNew) return;
    api.get<SectionTemplate>(`/admin/section-templates/${id}`)
      .then((t) => {
        setForm({
          name: t.name,
          slug: t.slug,
          description: t.description || "",
          tsx_code: t.tsx_code || "",
          css_code: t.css_code || "",
          field_schema: t.field_schema,
          data_source: t.data_source || "",
        });
        setPublished(t.published);
        try { setFields(JSON.parse(t.field_schema)); } catch { setFields([]); }
      })
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Sync fields → form.field_schema
  useEffect(() => {
    setForm((f) => ({ ...f, field_schema: JSON.stringify(fields) }));
  }, [fields]);

  // Auto-slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .trim()
      .replace(/\s+/g, "")
      .replace(/[^a-zA-Z0-9]/g, "");
    setForm((f) => ({ ...f, name, slug: isNew ? slug : f.slug }));
  };

  const addField = () =>
    setFields([...fields, { name: "", type: "text" }]);

  const updateField = (i: number, patch: Partial<FieldSchema>) =>
    setFields(fields.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));

  const removeField = (i: number) =>
    setFields(fields.filter((_, idx) => idx !== i));

  // Save template
  const handleSave = async () => {
    if (!form.name || !form.slug) {
      setError("Name and slug are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const body = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        tsx_code: form.tsx_code,
        css_code: form.css_code,
        field_schema: form.field_schema,
        data_source: form.data_source || null,
      };
      if (isNew) {
        const created = await api.post<SectionTemplate>("/admin/section-templates", body);
        navigate(`/admin/template-editor/${created.id}`, { replace: true });
      } else {
        await api.patch(`/admin/section-templates/${id}`, body);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // Publish to GitHub
  const handlePublish = async () => {
    if (!id || isNew) {
      setError("Save the template first before publishing.");
      return;
    }
    if (!form.tsx_code) {
      setError("Add TSX code before publishing.");
      return;
    }
    setPublishing(true);
    setError("");
    try {
      await api.post(`/admin/section-templates/${id}/publish`, {});
      setPublished(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPublishing(false);
    }
  };

  // Copy prompt
  const handleCopyPrompt = () => {
    const prompt = buildPrompt(sectionDescription, fields, form.data_source, form.slug || "MySection");
    navigator.clipboard.writeText(prompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  if (loading) return <div className={ui.loading}>Loading…</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>
      {/* ── Header ── */}
      <div className={ui.pageHeader} style={{ flexShrink: 0 }}>
        <div>
          <div className={ui.pageTitle}>
            {isNew ? "New Section Template" : `Edit: ${form.name}`}
          </div>
          {published && (
            <span className={`${ui.badge} ${ui.badgeGray}`} style={{ marginTop: 4 }}>
              ✓ Published to GitHub
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className={`${ui.btn} ${ui.btnSecondary}`}
            onClick={() => navigate("/admin/component-library")}
          >
            <ChevronLeft size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
            Library
          </button>
          <button
            className={`${ui.btn} ${ui.btnSecondary}`}
            onClick={() => setPromptModal(true)}
          >
            ✦ Get AI Prompt
          </button>
          {canEdit && (
            <button
              className={`${ui.btn} ${ui.btnSecondary}`}
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
              {saving ? "Saving…" : "Save"}
            </button>
          )}
          {canEdit && !isNew && (
            <button
              className={`${ui.btn} ${ui.btnPrimary}`}
              onClick={handlePublish}
              disabled={publishing || !form.tsx_code}
            >
              <Send size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
              {publishing ? "Publishing…" : published ? "Re-publish" : "Publish to GitHub"}
            </button>
          )}
        </div>
      </div>

      {error && <div className={ui.errorMsg} style={{ margin: "0 0 12px" }}>{error}</div>}

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #eee", flexShrink: 0 }}>
        {(["info", "code", "preview"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 20px",
              fontSize: 13,
              fontWeight: tab === t ? 700 : 400,
              color: tab === t ? "#000" : "#999",
              background: "none",
              border: "none",
              borderBottom: tab === t ? "2px solid #000" : "2px solid transparent",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {t === "preview" && <Eye size={12} style={{ marginRight: 4, verticalAlign: -1 }} />}
            {t}
          </button>
        ))}
      </div>

      {/* ── Tab: Info ── */}
      {tab === "info" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 0" }}>
          <div style={{ maxWidth: 640 }}>
            <div className={ui.form}>
              <div className={ui.field}>
                <label className={ui.label}>Template Name *</label>
                <input
                  className={ui.input}
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Dark Hero with Video"
                />
              </div>
              <div className={ui.field}>
                <label className={ui.label}>Slug (component filename) *</label>
                <input
                  className={ui.input}
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. DarkHeroWithVideo"
                />
                <div className={ui.hint}>
                  Must be PascalCase — this becomes <code>{form.slug || "MySection"}.tsx</code> on GitHub.
                </div>
              </div>
              <div className={ui.field}>
                <label className={ui.label}>Description</label>
                <textarea
                  className={ui.input}
                  style={{ minHeight: 70 }}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What does this section do? Describe its purpose."
                />
              </div>
              <div className={ui.field}>
                <label className={ui.label}>Live Data Source</label>
                <select
                  className={ui.select}
                  value={form.data_source}
                  onChange={(e) => setForm({ ...form, data_source: e.target.value })}
                >
                  {DATA_SOURCES.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                <div className={ui.hint}>
                  If set, instances of this section will receive live rows from this table as an <code>items</code> prop.
                </div>
              </div>

              {/* Fields */}
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <label className={ui.label} style={{ marginBottom: 0 }}>
                    Placeholder Fields
                  </label>
                  <button className={ui.iconBtn} onClick={addField} title="Add field">
                    + Add field
                  </button>
                </div>
                <div className={ui.hint} style={{ marginBottom: 10 }}>
                  Describe what data fields this component uses. This is used to generate the AI prompt.
                </div>
                {fields.length === 0 && (
                  <div style={{ fontSize: 12, color: "#ccc", fontStyle: "italic" }}>
                    No fields defined — the component will use placeholder-data.json values.
                  </div>
                )}
                {fields.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                    <input
                      className={ui.input}
                      style={{ flex: 2 }}
                      value={f.name}
                      onChange={(e) => updateField(i, { name: e.target.value })}
                      placeholder="Field name (e.g. heading)"
                    />
                    <select
                      className={ui.select}
                      style={{ flex: 1 }}
                      value={f.type}
                      onChange={(e) => updateField(i, { type: e.target.value as FieldSchema["type"] })}
                    >
                      <option value="text">text</option>
                      <option value="image">image</option>
                      <option value="richtext">richtext</option>
                      <option value="list">list</option>
                    </select>
                    <button className={ui.iconBtn} onClick={() => removeField(i)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Code ── */}
      {tab === "code" && (
        <div style={{ flex: 1, display: "flex", gap: 0, overflow: "hidden" }}>
          {/* TSX editor */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: "1px solid #eee" }}>
            <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "#999", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
              <span>{form.slug || "Component"}.tsx</span>
              <span style={{ fontWeight: 400 }}>TSX</span>
            </div>
            <textarea
              style={{
                flex: 1, resize: "none", border: "none", outline: "none",
                fontFamily: "monospace", fontSize: 12, lineHeight: 1.6,
                padding: 16, background: "#fafafa",
              }}
              value={form.tsx_code}
              onChange={(e) => setForm({ ...form, tsx_code: e.target.value })}
              placeholder={`// Paste your ${form.slug || "Component"}.tsx code here\n// Use "Get AI Prompt" to generate it`}
              spellCheck={false}
            />
          </div>
          {/* CSS editor */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "#999", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
              <span>{form.slug || "Component"}.module.css</span>
              <span style={{ fontWeight: 400 }}>CSS Modules</span>
            </div>
            <textarea
              style={{
                flex: 1, resize: "none", border: "none", outline: "none",
                fontFamily: "monospace", fontSize: 12, lineHeight: 1.6,
                padding: 16, background: "#fafafa",
              }}
              value={form.css_code}
              onChange={(e) => setForm({ ...form, css_code: e.target.value })}
              placeholder={`/* Paste your ${form.slug || "Component"}.module.css code here */`}
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* ── Tab: Preview ── */}
      {tab === "preview" && (
        <div style={{ flex: 1, overflow: "hidden", background: "#f5f5f5", padding: 16 }}>
          {!form.tsx_code ? (
            <div className={ui.empty}>
              <div className={ui.emptyIcon}>◱</div>
              Paste TSX code in the Code tab first, then come back here to preview.
            </div>
          ) : (
            <div style={{ height: "100%", background: "#fff", borderRadius: 4, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <LivePreview tsxCode={form.tsx_code} cssCode={form.css_code} />
            </div>
          )}
        </div>
      )}

      {/* ── AI Prompt Modal ── */}
      {promptModal && (
        <div className={ui.overlay}>
          <div className={ui.modal} style={{ maxWidth: 680 }}>
            <div className={ui.modalHeader}>
              <div className={ui.modalTitle}>✦ Get AI Prompt</div>
              <button className={ui.modalClose} onClick={() => setPromptModal(false)}>✕</button>
            </div>
            <div className={ui.modalBody}>
              <div className={ui.form}>
                <div className={ui.field}>
                  <label className={ui.label}>Describe the section you want *</label>
                  <textarea
                    className={ui.input}
                    style={{ minHeight: 100 }}
                    value={sectionDescription}
                    onChange={(e) => setSectionDescription(e.target.value)}
                    placeholder="e.g. A full-width hero section with a large background image, a centered headline, a short subtitle, and two buttons side by side. Dark overlay on the image. Clean, minimal fashion brand aesthetic."
                  />
                  <div className={ui.hint}>
                    Be as descriptive as you like — layout, colors, content, behaviour.
                  </div>
                </div>
                <div style={{
                  background: "#f9f9f9", border: "1px solid #eee", borderRadius: 6,
                  padding: 16, fontSize: 11, fontFamily: "monospace", lineHeight: 1.7,
                  whiteSpace: "pre-wrap", maxHeight: 260, overflowY: "auto", color: "#444",
                }}>
                  {buildPrompt(
                    sectionDescription || "(describe your section above)",
                    fields,
                    form.data_source,
                    form.slug || "MySection",
                  )}
                </div>
              </div>
            </div>
            <div className={ui.modalFooter}>
              <button
                className={`${ui.btn} ${ui.btnSecondary}`}
                onClick={() => setPromptModal(false)}
              >
                Close
              </button>
              <button
                className={`${ui.btn} ${ui.btnPrimary}`}
                onClick={handleCopyPrompt}
                disabled={!sectionDescription}
              >
                {promptCopied ? (
                  <><Check size={13} style={{ marginRight: 4 }} /> Copied!</>
                ) : (
                  <><Copy size={13} style={{ marginRight: 4 }} /> Copy Prompt</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}