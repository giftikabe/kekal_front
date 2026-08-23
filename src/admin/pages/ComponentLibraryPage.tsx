/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ExternalLink } from "lucide-react";
import { pagesApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ui from "../components/ui.module.css";

// All .tsx components in kekal/components — update this list when you add new ones
const REGISTERED_COMPONENTS = [
  "Hero",
  "AnnouncementBar",
  "FeaturedCollections",
  "CollectionsGrid",
  "CollectionsHero",
  "CollectionHero",
  "CollectionStorySection",
  "DesignerSection",
  "DesignerStorySection",
  "StatsBar",
  "QuoteSection",
  "ContactCTASection",
  "ContactSection",
  "ContactFormSection",
  "ContactDetailsSection",
  "ContactHero",
  "CommunityEventsSection",
  "CommunityEventsHero",
  "CommunityImpact",
  "UpcomingEvents",
  "EventsArchive",
  "EventHero",
  "HomeValueCards",
  "ProductsGrid",
  "RelatedProductsGrid",
  "AboutHero",
  "AboutcontentSection",
  "ImageSlider",
  "SitotaHero",
  "SitotaGiftCards",
  "AcademiaHero",
  "CourseTeaserCards",
  "SectionHeader",
  "Footer",
  "Header",
] as const;

interface Template {
  id: string;
  templateName: string | null;
  sectionName: string | null;
  sectionHeader: string | null;
  componentId: string | null;
  pageId: string;
  layoutOrder: number;
  isVisible: boolean;
}

interface Page {
  id: string;
  name: string;
  route: string;
}

export default function ComponentLibraryPage() {
  const { hasPermission } = useAuthContext();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  const canDelete = hasPermission("page_sections", "delete");

  useEffect(() => {
    Promise.all([pagesApi.getTemplates(), pagesApi.getAll()])
      .then(([t, p]) => {
        setTemplates(t as Template[]);
        setPages(p as Page[]);
      })
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const removeTemplate = async (id: string) => {
    if (!confirm("Remove template name from this section? The section stays on its page.")) return;
    try {
      await pagesApi.updateSection(id, { templateName: null });
      setTemplates(templates.filter((t) => t.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const pageNameFor = (pageId: string) =>
    pages.find((p) => p.id === pageId)?.name ?? "Unknown page";

  const filtered = filter
    ? REGISTERED_COMPONENTS.filter((c) =>
        c.toLowerCase().includes(filter.toLowerCase()),
      )
    : REGISTERED_COMPONENTS;

  if (loading) return <div className={ui.loading}>Loading…</div>;

  return (
    <div>
      <div className={ui.pageHeader}>
        <div>
          <div className={ui.pageTitle}>Component Library</div>
          <div className={ui.pageCount}>
            {REGISTERED_COMPONENTS.length} components · {templates.length} saved templates
          </div>
        </div>
      </div>

      {error && <div className={ui.errorMsg}>{error}</div>}

      {/* ── All registered components ── */}
      <div className={ui.card} style={{ marginBottom: 24 }}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#999",
            }}
          >
            Available Components
          </div>
          <input
            className={ui.input}
            style={{ maxWidth: 220, fontSize: 12, padding: "6px 10px" }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter components…"
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 1,
            background: "#eee",
          }}
        >
          {filtered.map((name) => (
            <div
              key={name}
              style={{
                background: "#fff",
                padding: "14px 16px",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: "#bbb",
                  marginTop: 2,
                }}
              >
                {name}.tsx
              </div>
              <button
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  color: "#666",
                  background: "#f5f5f5",
                  border: "none",
                  padding: "4px 10px",
                  borderRadius: 4,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
                onClick={() => navigate(`/admin/page-builder`)}
                title="Use in Page Builder"
              >
                <ExternalLink size={11} /> Use in Builder
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Saved templates ── */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#999",
          marginBottom: 12,
        }}
      >
        Saved Templates
      </div>

      {templates.length === 0 ? (
        <div className={ui.empty}>
          <div className={ui.emptyIcon}>◱</div>
          No templates yet. In the Page Builder, click "+ template" on any section to save it as a reusable template.
        </div>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th>Template Name</th>
                <th>Component</th>
                <th>Source Page</th>
                <th>Header</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.templateName}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 11, color: "#999" }}>
                    {t.componentId || t.sectionName || "—"}
                  </td>
                  <td style={{ fontSize: 12, color: "#666" }}>
                    {pageNameFor(t.pageId)}
                  </td>
                  <td style={{ fontSize: 12, color: "#666" }}>
                    {t.sectionHeader || "—"}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {canDelete && (
                      <button
                        className={ui.iconBtn}
                        onClick={() => removeTemplate(t.id)}
                        title="Remove template"
                        style={{ color: "#e53" }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}