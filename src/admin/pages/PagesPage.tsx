/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus } from "lucide-react";
import { pagesApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import RichTextarea from "../components/RichTextarea";
import ImageUpload from "../components/ImageUpload";
import ui from "../components/ui.module.css";

interface Page {
  id: string;
  name: string;
  route: string;
}
interface PageSection {
  id: string;
  pageId: string;
  sectionName: string;
  sectionHeader: string;
  buttonLabels: string[];
}
interface PageSeo {
  id: string;
  route: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  socialImage: string;
}

const KNOWN_SECTION_NAMES = [
  "hero",
  "featured_collections",
  "designer_section",
  "upcoming_event",
  "upcoming_events",
  "community_events",
  "designer_story",
  "collection_story",
  "products",
  "related_products",
  "event_archive",
  "community_impact",
  "contact_form",
  "contact_details",
];

export default function PagesPage() {
  const { hasPermission } = useAuthContext();
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [seo, setSeo] = useState<PageSeo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [pageModal, setPageModal] = useState<"create" | null>(null);
  const [pageForm, setPageForm] = useState({
    name: "",
    route: "",
    firstSectionName: KNOWN_SECTION_NAMES[0],
    firstSectionHeader: "",
  });
  const [pageSaving, setPageSaving] = useState(false);

  const [sectionModal, setSectionModal] = useState<string | null>(null);
  const [sectionForm, setSectionForm] = useState({
    sectionName: KNOWN_SECTION_NAMES[0],
    customName: "",
    sectionHeader: "",
    buttonLabels: "",
  });
  const [sectionSaving, setSectionSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [p, s, se] = await Promise.all([
          pagesApi.getAll(),
          pagesApi.getSections(),
          pagesApi.getSeo(),
        ]);
        setPages(p as Page[]);
        setSections(s as PageSection[]);
        setSeo(se as PageSeo[]);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const showSaved = (id: string) => {
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  const updateSection = async (id: string, field: string, value: any) => {
    setSaving(id + field);
    try {
      await pagesApi.updateSection(id, { [field]: value });
      setSections(
        sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
      );
      showSaved(id + field);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  };

  const updateSeo = async (id: string, field: string, value: any) => {
    setSaving(id + field);
    try {
      await pagesApi.updateSeo(id, { [field]: value });
      setSeo(seo.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
      showSaved(id + field);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  };

  const canEdit = hasPermission("pages", "update");
  const canCreate = hasPermission("pages", "create");

  const openPageModal = () => {
    setPageForm({
      name: "",
      route: "",
      firstSectionName: KNOWN_SECTION_NAMES[0],
      firstSectionHeader: "",
    });
    setPageModal("create");
  };

  const handleCreatePage = async () => {
    if (!pageForm.name || !pageForm.route || !pageForm.firstSectionHeader)
      return;
    setPageSaving(true);
    try {
      const newPage = (await pagesApi.create({
        name: pageForm.name,
        route: pageForm.route,
      })) as Page;
      const newSection = (await pagesApi.createSection({
        pageId: newPage.id,
        sectionName: pageForm.firstSectionName,
        sectionHeader: pageForm.firstSectionHeader,
        buttonLabels: [],
      })) as PageSection;
      setPages([...pages, newPage]);
      setSections([...sections, newSection]);
      setPageModal(null);
      setExpanded(newPage.id);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPageSaving(false);
    }
  };

  const openSectionModal = (pageId: string) => {
    setSectionForm({
      sectionName: KNOWN_SECTION_NAMES[0],
      customName: "",
      sectionHeader: "",
      buttonLabels: "",
    });
    setSectionModal(pageId);
  };

  const handleCreateSection = async () => {
    if (!sectionModal) return;
    const resolvedName =
      sectionForm.sectionName === "__custom__"
        ? sectionForm.customName.trim()
        : sectionForm.sectionName;
    if (!resolvedName || !sectionForm.sectionHeader) return;
    setSectionSaving(true);
    try {
      const created = (await pagesApi.createSection({
        pageId: sectionModal,
        sectionName: resolvedName,
        sectionHeader: sectionForm.sectionHeader,
        buttonLabels: sectionForm.buttonLabels
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean),
      })) as PageSection;
      setSections([...sections, created]);
      setSectionModal(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSectionSaving(false);
    }
  };

  if (loading) return <div className={ui.loading}>Loading...</div>;

  return (
    <div>
      <div className={ui.pageHeader}>
        <div>
          <div className={ui.pageTitle}>Pages & SEO</div>
          <div className={ui.pageCount}>{pages.length} pages</div>
        </div>
        {canCreate && (
          <button
            className={`${ui.btn} ${ui.btnPrimary}`}
            onClick={openPageModal}
          >
            <Plus size={13} style={{ marginRight: 6, verticalAlign: -2 }} /> New
            Page
          </button>
        )}
      </div>

      {error && <div className={ui.errorMsg}>{error}</div>}

      {pages.length === 0 ? (
        <div className={ui.empty}>
          <div className={ui.emptyIcon}>◱</div>No pages yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pages.map((page) => {
            const isOpen = expanded === page.id;
            const pageSections = sections.filter((s) => s.pageId === page.id);
            const pageSeo = seo.find((s) => s.route === page.route);

            return (
              <div key={page.id} className={ui.card} style={{ padding: 0 }}>
                <button
                  onClick={() => setExpanded(isOpen ? null : page.id)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 20px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    {isOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                    <div>
                      <div
                        style={{ fontSize: 14, fontWeight: 700, color: "#000" }}
                      >
                        {page.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "monospace",
                          fontSize: 11,
                          color: "#999",
                          marginTop: 2,
                        }}
                      >
                        {page.route}
                      </div>
                    </div>
                  </div>
                  <span className={`${ui.badge} ${ui.badgeGray}`}>
                    {pageSections.length} section
                    {pageSections.length === 1 ? "" : "s"}
                  </span>
                </button>

                {isOpen && (
                  <div style={{ borderTop: "1px solid #eee", padding: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
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
                        Sections
                      </div>
                      {canCreate && (
                        <button
                          className={ui.iconBtn}
                          onClick={() => openSectionModal(page.id)}
                          aria-label="Add section"
                          title="Add section"
                        >
                          <Plus size={14} />
                        </button>
                      )}
                    </div>

                    {pageSections.length > 0 ? (
                      <div
                        className={ui.tableWrap}
                        style={{ marginBottom: 24 }}
                      >
                        <table className={ui.table}>
                          <thead>
                            <tr>
                              <th>Section</th>
                              <th>Header</th>
                              <th>Button Labels</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pageSections.map((s) => (
                              <SectionRow
                                key={s.id}
                                section={s}
                                canEdit={canEdit}
                                saving={saving}
                                saved={saved}
                                onUpdate={updateSection}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#ccc",
                          fontStyle: "italic",
                          marginBottom: 24,
                        }}
                      >
                        No sections yet.
                      </div>
                    )}

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
                      SEO Settings
                    </div>
                    {pageSeo ? (
                      <SeoFields
                        item={pageSeo}
                        canEdit={canEdit}
                        saving={saving}
                        saved={saved}
                        onUpdate={updateSeo}
                      />
                    ) : (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#ccc",
                          fontStyle: "italic",
                        }}
                      >
                        No SEO entry for this route yet — one is created
                        automatically the first time content referencing this
                        route is saved.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {pageModal === "create" && (
        <div className={ui.overlay}>
          <div className={ui.modal}>
            <div className={ui.modalHeader}>
              <div className={ui.modalTitle}>New Page</div>
              <button
                className={ui.modalClose}
                onClick={() => setPageModal(null)}
              >
                ✕
              </button>
            </div>
            <div className={ui.modalBody}>
              <div className={ui.form}>
                <div className={ui.field}>
                  <label className={ui.label}>Page Name *</label>
                  <input
                    className={ui.input}
                    value={pageForm.name}
                    onChange={(e) =>
                      setPageForm({ ...pageForm, name: e.target.value })
                    }
                    placeholder="e.g. Lookbook"
                  />
                </div>
                <div className={ui.field}>
                  <label className={ui.label}>Route *</label>
                  <input
                    className={ui.input}
                    value={pageForm.route}
                    onChange={(e) =>
                      setPageForm({ ...pageForm, route: e.target.value })
                    }
                    placeholder="/lookbook"
                  />
                </div>
                <div className={ui.hint}>
                  Every page needs at least one section to start with.
                </div>
                <div className={ui.field}>
                  <label className={ui.label}>First Section Type *</label>
                  <select
                    className={ui.select}
                    value={pageForm.firstSectionName}
                    onChange={(e) =>
                      setPageForm({
                        ...pageForm,
                        firstSectionName: e.target.value,
                      })
                    }
                  >
                    {KNOWN_SECTION_NAMES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={ui.field}>
                  <label className={ui.label}>Section Header *</label>
                  <input
                    className={ui.input}
                    value={pageForm.firstSectionHeader}
                    onChange={(e) =>
                      setPageForm({
                        ...pageForm,
                        firstSectionHeader: e.target.value,
                      })
                    }
                    placeholder="e.g. The Lookbook"
                  />
                </div>
              </div>
            </div>
            <div className={ui.modalFooter}>
              <button
                className={`${ui.btn} ${ui.btnSecondary}`}
                onClick={() => setPageModal(null)}
              >
                Cancel
              </button>
              <button
                className={`${ui.btn} ${ui.btnPrimary}`}
                onClick={handleCreatePage}
                disabled={pageSaving}
              >
                {pageSaving ? "Creating..." : "Create Page"}
              </button>
            </div>
          </div>
        </div>
      )}

      {sectionModal && (
        <div className={ui.overlay}>
          <div className={ui.modal}>
            <div className={ui.modalHeader}>
              <div className={ui.modalTitle}>Add Section</div>
              <button
                className={ui.modalClose}
                onClick={() => setSectionModal(null)}
              >
                ✕
              </button>
            </div>
            <div className={ui.modalBody}>
              <div className={ui.form}>
                <div className={ui.field}>
                  <label className={ui.label}>Section Type *</label>
                  <select
                    className={ui.select}
                    value={sectionForm.sectionName}
                    onChange={(e) =>
                      setSectionForm({
                        ...sectionForm,
                        sectionName: e.target.value,
                      })
                    }
                  >
                    {KNOWN_SECTION_NAMES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                    <option value="__custom__">Custom name…</option>
                  </select>
                </div>
                {sectionForm.sectionName === "__custom__" && (
                  <div className={ui.field}>
                    <label className={ui.label}>Custom Section Name *</label>
                    <input
                      className={ui.input}
                      value={sectionForm.customName}
                      onChange={(e) =>
                        setSectionForm({
                          ...sectionForm,
                          customName: e.target.value,
                        })
                      }
                      placeholder="e.g. press_mentions"
                    />
                  </div>
                )}
                <div className={ui.field}>
                  <label className={ui.label}>Section Header *</label>
                  <input
                    className={ui.input}
                    value={sectionForm.sectionHeader}
                    onChange={(e) =>
                      setSectionForm({
                        ...sectionForm,
                        sectionHeader: e.target.value,
                      })
                    }
                    placeholder="e.g. As Seen In"
                  />
                </div>
                <div className={ui.field}>
                  <label className={ui.label}>Button Labels</label>
                  <input
                    className={ui.input}
                    value={sectionForm.buttonLabels}
                    onChange={(e) =>
                      setSectionForm({
                        ...sectionForm,
                        buttonLabels: e.target.value,
                      })
                    }
                    placeholder="Button 1, Button 2"
                  />
                  <div className={ui.hint}>Comma-separated, optional</div>
                </div>
              </div>
            </div>
            <div className={ui.modalFooter}>
              <button
                className={`${ui.btn} ${ui.btnSecondary}`}
                onClick={() => setSectionModal(null)}
              >
                Cancel
              </button>
              <button
                className={`${ui.btn} ${ui.btnPrimary}`}
                onClick={handleCreateSection}
                disabled={sectionSaving}
              >
                {sectionSaving ? "Adding..." : "Add Section"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionRow({
  section,
  canEdit,
  saving,
  saved,
  onUpdate,
}: {
  section: PageSection;
  canEdit: boolean;
  saving: string | null;
  saved: string | null;
  onUpdate: (id: string, field: string, value: any) => void;
}) {
  const [header, setHeader] = useState(section.sectionHeader);
  const [buttons, setButtons] = useState(
    section.buttonLabels?.join(", ") || "",
  );
  const headerChanged = header !== section.sectionHeader;
  const buttonsChanged = buttons !== (section.buttonLabels?.join(", ") || "");

  return (
    <tr>
      <td
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          color: "#999",
          whiteSpace: "nowrap",
        }}
      >
        {section.sectionName}
      </td>
      <td>
        {canEdit ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              className={ui.input}
              style={{ fontSize: 12, padding: "6px 8px" }}
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              placeholder="Section header text"
              aria-label={`Header for ${section.sectionName} section`}
            />
            <button
              className={ui.iconBtn}
              style={{ opacity: headerChanged ? 1 : 0.3 }}
              disabled={
                !headerChanged || saving === section.id + "sectionHeader"
              }
              onClick={() => onUpdate(section.id, "sectionHeader", header)}
              aria-label="Save"
            >
              {saved === section.id + "sectionHeader" ? (
                "✓"
              ) : (
                <Pencil size={13} />
              )}
            </button>
          </div>
        ) : (
          <span style={{ fontSize: 13 }}>{section.sectionHeader}</span>
        )}
      </td>
      <td>
        {canEdit ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              className={ui.input}
              style={{ fontSize: 12, padding: "6px 8px" }}
              value={buttons}
              onChange={(e) => setButtons(e.target.value)}
              placeholder="Button 1, Button 2"
              aria-label={`Button labels for ${section.sectionName} section`}
            />
            <button
              className={ui.iconBtn}
              style={{ opacity: buttonsChanged ? 1 : 0.3 }}
              disabled={
                !buttonsChanged || saving === section.id + "buttonLabels"
              }
              onClick={() =>
                onUpdate(
                  section.id,
                  "buttonLabels",
                  buttons
                    .split(",")
                    .map((b) => b.trim())
                    .filter(Boolean),
                )
              }
              aria-label="Save"
            >
              {saved === section.id + "buttonLabels" ? (
                "✓"
              ) : (
                <Pencil size={13} />
              )}
            </button>
          </div>
        ) : (
          <span style={{ fontSize: 12, color: "#666" }}>
            {section.buttonLabels?.join(", ")}
          </span>
        )}
      </td>
    </tr>
  );
}

function SeoFields({
  item,
  canEdit,
  saving,
  saved,
  onUpdate,
}: {
  item: PageSeo;
  canEdit: boolean;
  saving: string | null;
  saved: string | null;
  onUpdate: (id: string, field: string, value: any) => void;
}) {
  const [metaTitle, setMetaTitle] = useState(item.metaTitle);
  const [metaDesc, setMetaDesc] = useState(item.metaDescription);
  const [keywords, setKeywords] = useState(item.keywords?.join(", ") || "");
  const [socialImage, setSocialImage] = useState(item.socialImage);

  return (
    <div className={ui.form}>
      <InlineSave
        label="Meta Title"
        value={metaTitle}
        onChange={setMetaTitle}
        original={item.metaTitle}
        onSave={() => onUpdate(item.id, "metaTitle", metaTitle)}
        id={item.id + "metaTitle"}
        saving={saving}
        saved={saved}
        canEdit={canEdit}
        placeholder="Title shown in search results and browser tabs"
      />
      <InlineSaveRich
        label="Meta Description"
        value={metaDesc}
        onChange={setMetaDesc}
        original={item.metaDescription}
        onSave={() => onUpdate(item.id, "metaDescription", metaDesc)}
        id={item.id + "metaDescription"}
        saving={saving}
        saved={saved}
        canEdit={canEdit}
      />
      <InlineSave
        label="Keywords (comma-separated)"
        value={keywords}
        onChange={setKeywords}
        original={item.keywords?.join(", ") || ""}
        onSave={() =>
          onUpdate(
            item.id,
            "keywords",
            keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean),
          )
        }
        id={item.id + "keywords"}
        saving={saving}
        saved={saved}
        canEdit={canEdit}
        placeholder="e.g. ethiopian fashion, slow fashion"
      />
      <div className={ui.field}>
        <label className={ui.label}>Social Image</label>
        <div className={ui.hint} style={{ marginBottom: 6 }}>
          Leave blank to automatically use this page's main image, or the site
          logo if that's also unset.
        </div>
        <ImageUpload
          value={socialImage}
          onChange={(url) => {
            setSocialImage(url);
            onUpdate(item.id, "socialImage", url);
          }}
          disabled={!canEdit}
          previewMaxWidth={240}
          previewMaxHeight={160}
        />
      </div>
    </div>
  );
}

function InlineSave({
  label,
  value,
  onChange,
  original,
  onSave,
  id,
  saving,
  saved,
  canEdit,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  original: string;
  onSave: () => void;
  id: string;
  saving: string | null;
  saved: string | null;
  canEdit: boolean;
  placeholder?: string;
}) {
  const changed = value !== original;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div className={ui.field} style={{ flex: 1 }}>
        <label className={ui.label}>{label}</label>
        <input
          className={ui.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!canEdit}
          placeholder={placeholder}
        />
      </div>
      {canEdit && (
        <div style={{ paddingTop: 22 }}>
          <button
            className={ui.iconBtn}
            style={{ opacity: changed ? 1 : 0.3 }}
            disabled={!changed || saving === id}
            onClick={onSave}
            aria-label="Save"
          >
            {saving === id ? "…" : saved === id ? "✓" : <Pencil size={13} />}
          </button>
        </div>
      )}
    </div>
  );
}

function InlineSaveRich({
  label,
  value,
  onChange,
  original,
  onSave,
  id,
  saving,
  saved,
  canEdit,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  original: string;
  onSave: () => void;
  id: string;
  saving: string | null;
  saved: string | null;
  canEdit: boolean;
}) {
  const changed = value !== original;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div className={ui.field} style={{ flex: 1 }}>
        <label className={ui.label}>{label}</label>
        <RichTextarea
          value={value}
          onChange={onChange}
          disabled={!canEdit}
          minHeight={70}
        />
      </div>
      {canEdit && (
        <div style={{ paddingTop: 22 }}>
          <button
            className={ui.iconBtn}
            style={{ opacity: changed ? 1 : 0.3 }}
            disabled={!changed || saving === id}
            onClick={onSave}
            aria-label="Save"
          >
            {saving === id ? "…" : saved === id ? "✓" : <Pencil size={13} />}
          </button>
        </div>
      )}
    </div>
  );
}
